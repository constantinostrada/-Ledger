---
id: 78622e61-4fce-40f0-af8d-d9c475184740-3
type: architecture
title: ITransactionRepository was extended with sumExpensesByCategory(userId, categoryIds,…
tags: [architecture]
created: 2026-07-22
resource: src/domain/repositories/ITransactionRepository.ts, PrismaTransactionRepository.ts.
---
ITransactionRepository was extended with sumExpensesByCategory(userId, categoryIds, dateFrom, dateToExclusive), implemented as a single Prisma groupBy aggregate over EXPENSE transactions.

## Where
src/domain/repositories/ITransactionRepository.ts, PrismaTransactionRepository.ts.
