---
id: 78622e61-4fce-40f0-af8d-d9c475184740-1
type: architecture
title: budgets table stores limit_cents (Int, integer cents) and period (Char(7), 'YYYY-MM'),…
tags: [architecture]
created: 2026-07-22
resource: prisma/schema.prisma, migration 20260722221457_add_budgets.
---
budgets table stores limit_cents (Int, integer cents) and period (Char(7), 'YYYY-MM'), with a unique constraint on (userId, categoryId, period) so there is exactly one limit per category per month.

## Where
prisma/schema.prisma, migration 20260722221457_add_budgets.
