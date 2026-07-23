---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-0
type: architecture
title: Category is now a per-user owned entity with a required `userId` FK (cascade delete),…
tags: [architecture]
created: 2026-07-23
resource: prisma/schema.prisma, src/domain/entities/Category.ts, migration 20260723000000_categories_per_user.
---
Category is now a per-user owned entity with a required `userId` FK (cascade delete), plus `kind` (INCOME/EXPENSE, reusing the existing TransactionType enum) and `color` (hex, VARCHAR(7)) columns.

## Why
B5 required category CRUD scoped per user with income/expense kind and color, extending the global Category added in B1.

## Where
prisma/schema.prisma, src/domain/entities/Category.ts, migration 20260723000000_categories_per_user.
