---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-3
type: decision
title: Category-grouped spend aggregation uses Prisma's groupBy, but the monthly income/expense…
tags: [decision]
created: 2026-07-23
resource: src/infrastructure/repositories/PrismaTransactionRepository.ts
---
Category-grouped spend aggregation uses Prisma's groupBy, but the monthly income/expense series uses a raw SQL query with date_trunc('month', ...) instead

## Why
Prisma's groupBy cannot group by a derived/truncated date expression

## Where
src/infrastructure/repositories/PrismaTransactionRepository.ts
