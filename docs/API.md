# API Documentation

## Overview

The Ledger API manages users, accounts, transactions, categories, budgets,
recurring rules and reports following RESTful principles.

Base URL (development): `http://localhost:3010/api`

Every endpoint is covered end-to-end by the integration tests in
`tests/integration/`, which drive the real route handlers against Postgres.

## Authentication

All endpoints except `/api/health`, `/api/auth/register` and
`/api/auth/login` require a JWT Bearer token:

```
Authorization: Bearer <token>
```

The token is issued by `POST /api/auth/register` and `POST /api/auth/login`.
Missing, malformed or invalid tokens always yield `401 {"error": "Unauthorized"}`.

**Ownership comes only from the token.** No request body or query string
accepts a `userId`; any such field sent by the client is stripped. A resource
belonging to another user is indistinguishable from one that does not exist —
the API answers `404`, never `403`, so resource ids cannot be probed.

## Conventions

- **Money is always integer cents.** Every monetary field is named `*Cents`
  and carries an integer (e.g. `1050` = $10.50). Floats, zero and negative
  amounts are rejected with `400`.
- **Currencies** are ISO 4217 three-letter codes. Supported: `USD`, `EUR`,
  `GBP`, `CHF`, `CAD`, `AUD`, `JPY`, `BRL`, `MXN`, `ARS`. Each user has a
  `baseCurrency` (default `USD`); every transaction snapshots its amount
  converted into it at posting time (`baseAmountCents`), and all balances and
  reports aggregate in it.
- **Balances are derived, never stored.** An account's balance is always the
  sum of its transactions (income − expense), so it can never drift.
- **Dates** are ISO 8601 strings (`2026-07-15T10:30:00.000Z`). Calendar
  months (budgets, reports) use `YYYY-MM`.
- **Errors** always have the shape `{"error": "<message>"}`. Validation
  failures return `400` with the Zod error detail as the message.

---

## Health

### GET /api/health

No authentication. Verifies the app and its database connection.

**Response `200`** (healthy) / **`503`** (unhealthy):

```json
{ "status": "healthy", "database": "connected", "timestamp": "ISO 8601" }
```

---

## Auth

### POST /api/auth/register

Creates a user, seeds their 9 starter categories and returns a token.

**Request body:**

```json
{
  "email": "string (required, valid email, max 255)",
  "password": "string (required, 8–72 chars)",
  "name": "string (optional, 1–100 chars)",
  "baseCurrency": "string (optional, 3-letter code, default USD)"
}
```

**Response `201`:**

```json
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string | null",
    "baseCurrency": "USD"
  }
}
```

**Errors:** `400` invalid input · `409` email already registered.

### POST /api/auth/login

**Request body:**

```json
{ "email": "string (required)", "password": "string (required)" }
```

**Response `200`:** same shape as register.

**Errors:** `400` invalid input · `401 {"error": "Invalid credentials"}` —
identical for unknown email and wrong password, so emails cannot be
enumerated.

---

## Accounts

An account holds a single currency; its balance is derived from its
transactions. Account shape returned by all account endpoints:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "type": "CHECKING | SAVINGS | CREDIT | INVESTMENT",
  "balanceCents": 100000,
  "currency": "USD",
  "balanceBaseCents": 100000,
  "baseCurrency": "USD",
  "isActive": true,
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### POST /api/accounts

**Request body:**

```json
{
  "name": "string (required, max 100)",
  "type": "CHECKING | SAVINGS | CREDIT | INVESTMENT (required)",
  "initialBalanceCents": "integer ≥ 0 (optional, default 0)",
  "currency": "string (optional, 3-letter code, default USD)"
}
```

A positive `initialBalanceCents` is materialized as an `INCOME` transaction
with note `"Opening balance"` — never stored as a balance field.

**Response `201`:** the account. **Errors:** `400` invalid input · `401`.

### GET /api/accounts

**Query parameters:**

- `includeArchived` (optional): `true` to include archived accounts; by
  default only active accounts are returned.

**Response `200`:** array of accounts. **Errors:** `401`.

### PATCH /api/accounts/{id}

**Request body** (at least one field required):

```json
{
  "name": "string (optional, max 100)",
  "type": "CHECKING | SAVINGS | CREDIT | INVESTMENT (optional)"
}
```

**Response `200`:** the updated account.

**Errors:** `400` no fields / invalid input · `401` · `404` not found or
owned by another user.

### DELETE /api/accounts/{id}

Archives (soft-deletes): the account keeps its transaction history and
disappears from the default list.

**Response `200`:** the account with `"isActive": false`.

**Errors:** `401` · `404` not found or owned by another user.

---

## Transactions

Transaction shape returned by all transaction endpoints:

```json
{
  "id": "uuid",
  "accountId": "uuid",
  "categoryId": "uuid | null",
  "recurringRuleId": "uuid | null",
  "amountCents": 1050,
  "currency": "EUR",
  "baseAmountCents": 1134,
  "baseCurrency": "USD",
  "type": "INCOME | EXPENSE",
  "note": "string",
  "date": "ISO 8601",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

`baseAmountCents` is the amount converted into the user's base currency at
posting time, rounded to the nearest cent — aggregates never re-convert.

### POST /api/transactions

**Request body:**

```json
{
  "accountId": "string (required)",
  "categoryId": "string (optional)",
  "amountCents": "integer > 0 (required)",
  "currency": "string (required, must match the account's currency)",
  "type": "INCOME | EXPENSE (required)",
  "note": "string (required, max 500)",
  "date": "ISO 8601 datetime (required)"
}
```

**Business rules:**

- `currency` must equal the account's currency.
- An `EXPENSE` that would make the balance negative is rejected
  (`Insufficient funds for expense transaction`).
- `categoryId`, when given, must be one of the caller's categories.

**Response `201`:** the transaction.

**Errors:** `400` invalid input / business-rule violation · `401` · `404`
account or category not found (or not the caller's).

### GET /api/transactions

**Query parameters (all optional):**

- `accountId` — restrict to one account; omitted means all of the caller's
  accounts. A missing or foreign account yields `404`.
- `categoryId` — restrict to one category (scoped to the caller; a foreign
  category simply matches nothing).
- `dateFrom`, `dateTo` — ISO 8601 datetimes; `dateFrom` must not be after
  `dateTo`.
- `limit` — 1–100, default 50.
- `offset` — ≥ 0, default 0.

**Response `200`:** array of transactions, newest first.

**Errors:** `400` invalid filters · `401` · `404` filtered account not found
(or not the caller's).

---

## Categories

Every new user starts with 9 seeded categories. Names are unique per user.
Category shape:

```json
{
  "id": "uuid",
  "name": "string",
  "kind": "INCOME | EXPENSE",
  "color": "#22C55E",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### POST /api/categories

**Request body:**

```json
{
  "name": "string (required, max 100, unique per user)",
  "kind": "INCOME | EXPENSE (required)",
  "color": "hex color like #22C55E (required)"
}
```

**Response `201`:** the category.

**Errors:** `400` invalid input · `401` · `409` name already exists.

### GET /api/categories

**Response `200`:** array of the caller's categories. **Errors:** `401`.

### PATCH /api/categories/{id}

**Request body** (at least one field required — `kind` is immutable and not
accepted):

```json
{ "name": "string (optional)", "color": "hex color (optional)" }
```

**Response `200`:** the updated category.

**Errors:** `400` no fields / invalid input · `401` · `404` not found or
owned by another user · `409` new name already exists.

### DELETE /api/categories/{id}

Hard-deletes an **unused** category. A category still referenced by any
transaction, recurring rule or budget is rejected.

**Response `204`:** no body.

**Errors:** `401` · `404` not found or owned by another user · `409` in use.

---

## Budgets

A budget is one spending limit per category per calendar month. Spent and
remaining amounts are derived from the period's `EXPENSE` transactions at
read time (in the user's base currency) — never stored. Budget shape:

```json
{
  "id": "uuid",
  "categoryId": "uuid",
  "period": "2026-07",
  "limitCents": 20000,
  "spentCents": 25000,
  "remainingCents": -1000,
  "percentUsed": 125,
  "overBudget": true,
  "currency": "USD",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

Exceeding a budget is only flagged (`overBudget: true`, negative
`remainingCents`) — transactions are never blocked by budgets.

### PUT /api/budgets

Idempotent upsert: setting the same category + period again updates the
existing budget's limit.

**Request body:**

```json
{
  "categoryId": "string (required)",
  "period": "YYYY-MM (required)",
  "limitCents": "integer > 0 (required)",
  "currency": "string (required, 3-letter code)"
}
```

**Response `200`:** the budget.

**Errors:** `400` invalid input · `401` · `404` category not found (or not
the caller's).

### GET /api/budgets

**Query parameters:**

- `period` (required): calendar month `YYYY-MM`.

**Response `200`:** array of the caller's budgets for that period.

**Errors:** `400` missing/invalid period · `401`.

---

## Recurring rules

A recurring rule is a template that materializes transactions on a schedule.
Rule shape:

```json
{
  "id": "uuid",
  "accountId": "uuid",
  "categoryId": "uuid | null",
  "amountCents": 1500,
  "currency": "USD",
  "type": "INCOME | EXPENSE",
  "note": "string",
  "interval": "DAILY | WEEKLY | MONTHLY",
  "startDate": "ISO 8601",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### POST /api/recurring-rules

**Request body:**

```json
{
  "accountId": "string (required)",
  "categoryId": "string (optional)",
  "amountCents": "integer > 0 (required)",
  "currency": "string (required, must match the account's currency)",
  "type": "INCOME | EXPENSE (required)",
  "note": "string (required, max 500)",
  "interval": "DAILY | WEEKLY | MONTHLY (required)",
  "startDate": "ISO 8601 datetime (required — the first due date)"
}
```

`MONTHLY` occurrences keep the start date's day-of-month, clamping to the
month's last day when shorter (e.g. Jan 31 → Feb 28).

**Response `201`:** the rule.

**Errors:** `400` invalid input / currency mismatch · `401` · `404` account
or category not found (or not the caller's).

### GET /api/recurring-rules

**Response `200`:** array of the caller's rules. **Errors:** `401`.

### POST /api/recurring-rules/sweep

Materializes every due occurrence (from each rule's `startDate` through now)
of the caller's rules as real transactions.

**Idempotent by construction:** a database unique constraint on
`(recurring_rule_id, date)` means occurrences already materialized are
skipped — POSTing twice never double-posts, and an immediate re-run reports
`createdCount: 0`.

No request body.

**Response `200`:**

```json
{ "dueCount": 3, "createdCount": 3 }
```

- `dueCount` — occurrences due across all the caller's rules as of the sweep.
- `createdCount` — transactions actually inserted by this run.

**Errors:** `401` · `400` on failure.

---

## Reports

All report amounts are integer cents in the caller's base currency.

### GET /api/reports/net-worth

Sums the derived balance of **all** the caller's accounts — archived
accounts included, since their history is still real money.

**Response `200`:**

```json
{
  "baseCurrency": "USD",
  "netWorthCents": 48800,
  "accounts": [
    {
      "accountId": "uuid",
      "name": "string",
      "type": "CHECKING",
      "currency": "USD",
      "balanceCents": 48800,
      "balanceBaseCents": 48800,
      "isActive": true
    }
  ]
}
```

**Errors:** `401` · `404` user not found.

### GET /api/reports/spend-by-category

**Query parameters:**

- `period` (required): calendar month `YYYY-MM`.

Groups the month's expenses by category; expenses without a category are
grouped under `categoryId: null`.

**Response `200`:**

```json
{
  "period": "2026-07",
  "baseCurrency": "USD",
  "totalSpentCents": 4000,
  "categories": [
    {
      "categoryId": "uuid | null",
      "categoryName": "string | null",
      "spentCents": 4000
    }
  ]
}
```

**Errors:** `400` invalid period · `401` · `404` user not found.

### GET /api/reports/income-vs-expense

**Query parameters:**

- `from` (required): first month of the series, `YYYY-MM`, inclusive.
- `to` (required): last month, `YYYY-MM`, inclusive. Must not be before
  `from`, and the range must not exceed 120 months.

**Response `200`** — one point per month, zero-filled for months with no
transactions:

```json
{
  "from": "2026-05",
  "to": "2026-07",
  "baseCurrency": "USD",
  "points": [
    { "period": "2026-05", "incomeCents": 0, "expenseCents": 0, "netCents": 0 },
    { "period": "2026-06", "incomeCents": 0, "expenseCents": 0, "netCents": 0 },
    {
      "period": "2026-07",
      "incomeCents": 30000,
      "expenseCents": 4000,
      "netCents": 26000
    }
  ]
}
```

**Errors:** `400` invalid months or inverted range · `401` · `404` user not
found.

---

## Status code summary

| Status | Meaning                                                                |
| ------ | ---------------------------------------------------------------------- |
| `200`  | Success (reads, updates, budget upsert, archive, sweep)                |
| `201`  | Resource created (register, accounts, transactions, categories, rules) |
| `204`  | Category deleted, no body                                              |
| `400`  | Validation failure or business-rule violation                          |
| `401`  | Missing/invalid token, or bad login credentials                        |
| `404`  | Resource missing — or owned by another user (never revealed as `403`)  |
| `409`  | Conflict: duplicate email, duplicate category name, category in use    |
| `500`  | Unexpected server error                                                |
| `503`  | Health check: database unreachable                                     |
