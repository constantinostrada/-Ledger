---
id: 3df2f590-37db-4403-a807-c757fa71fd79-10
type: decision
title: Renamed transaction vocabulary from DEBIT/CREDIT to INCOME/EXPENSE (and `description` field to `note`) across the entire stack — domain value object, entity, service, DTOs, zod schemas, Prisma enum/column — via migration `ALTER TYPE … RENAME VALUE` + `RENAME COLUMN`, instead of adding a translation layer between board language and code language.
tags: [decision]
created: 2026-07-22
resource: ledger/src/domain/value-objects/TransactionType.ts, domain/entities/Transaction.ts, prisma/schema.prisma, migration 20260722000001_income_expense_transactions
---
Renamed transaction vocabulary from DEBIT/CREDIT to INCOME/EXPENSE (and `description` field to `note`) across the entire stack — domain value object, entity, service, DTOs, zod schemas, Prisma enum/column — via migration `ALTER TYPE … RENAME VALUE`…

## Why
Product/board language is income/expense with a note; keeping DEBIT/CREDIT internally would require an ongoing translation layer at every boundary. A rename-in-place migration preserves existing rows.

## Learned
Legacy vocabulary (e.g. `"type": "CREDIT"`) is explicitly rejected by the new schema post-migration — verified via e2e test.

## Where
ledger/src/domain/value-objects/TransactionType.ts, domain/entities/Transaction.ts, prisma/schema.prisma, migration 20260722000001_income_expense_transactions
