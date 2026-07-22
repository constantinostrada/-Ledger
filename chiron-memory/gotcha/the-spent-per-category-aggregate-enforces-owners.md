---
id: 78622e61-4fce-40f0-af8d-d9c475184740-4
type: gotcha
title: The spent-per-category aggregate enforces ownership through the account→user relation in…
tags: [gotcha]
created: 2026-07-22
resource: PrismaTransactionRepository.sumExpensesByCategory.
---
The spent-per-category aggregate enforces ownership through the account→user relation in the Prisma query itself, not by filtering in application code.

## Why
prevents another user's transactions in the same category from leaking into a budget's spent total.

## Where
PrismaTransactionRepository.sumExpensesByCategory.
