---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-4
type: gotcha
title: The raw SQL for the monthly income/expense series must use positional GROUP BY (GROUP BY…
tags: [gotcha]
created: 2026-07-23
resource: src/infrastructure/repositories/PrismaTransactionRepository.ts
---
The raw SQL for the monthly income/expense series must use positional GROUP BY (GROUP BY 1, 2) instead of GROUP BY month, type

## Why
both the transactions and accounts tables have a column named type, so an unqualified GROUP BY type is ambiguous in Postgres and errors

## Learned
caught only by a manual curl end-to-end run against a live dev server, not by the unit tests with fake repositories

## Where
src/infrastructure/repositories/PrismaTransactionRepository.ts
