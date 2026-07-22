---
id: 3df2f590-37db-4403-a807-c757fa71fd79-11
type: gotcha
title: `AccountType` enum also has a `CREDIT` value (credit-card account type) that is unrelated…
tags: [gotcha]
created: 2026-07-22
resource: ledger/src/domain/value-objects (AccountType) vs TransactionType
---
`AccountType` enum also has a `CREDIT` value (credit-card account type) that is unrelated to the transaction DEBIT/CREDIT rename and must stay untouched.

## Why
Easy to accidentally rename/grep-replace the wrong `CREDIT` symbol when doing a stack-wide vocabulary migration.

## Learned
Before a bulk rename of an enum value, check for other enums in the codebase reusing the same literal name.

## Where
ledger/src/domain/value-objects (AccountType) vs TransactionType
