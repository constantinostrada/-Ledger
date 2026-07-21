---
type: convention
title: Prisma schema stores all monetary fields as `Int` cents columns (e.g. balance_cents, amount_cents), never Decimal/Float; DTOs mirror this with explicit `*Cents` field names (balanceCents, amountCents) instead of generic amount/balance, and zod validation schemas enforce `.int()` on them.
tags: [convention]
created: 2026-07-21
resource: prisma/schema.prisma, src/application/dtos/*.ts, src/interfaces/validation/*Schemas.ts.
---
Prisma schema stores all monetary fields as `Int` cents columns (e.g. balance_cents, amount_cents), never Decimal/Float; DTOs mirror this with explicit `*Cents` field names (balanceCents, amountCents) instead of generic amount/balance, and zod valid…

## Where
prisma/schema.prisma, src/application/dtos/*.ts, src/interfaces/validation/*Schemas.ts.
