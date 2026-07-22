---
id: 3df2f590-37db-4403-a807-c757fa71fd79-12
type: architecture
title: `ITransactionRepository.findByAccountIdWithPagination` was replaced by a unified `findByFilter(filter, limit, offset)`, where `filter` always carries the authenticated `userId`; the Prisma implementation enforces ownership through the account relation join so a foreign `accountId`/`categoryId` can never leak another user's transactions (returns 404 "Account not found" instead).
tags: [architecture]
created: 2026-07-22
resource: ledger/src/domain/repositories/ITransactionRepository.ts, infrastructure/repositories/PrismaTransactionRepository.ts
---
`ITransactionRepository.findByAccountIdWithPagination` was replaced by a unified `findByFilter(filter, limit, offset)`, where `filter` always carries the authenticated `userId`; the Prisma implementation enforces ownership through the account relati…

## Learned
GET /api/transactions now takes optional accountId/categoryId/dateFrom/dateTo filters (all optional) with no-filter meaning "all transactions across the user's accounts, newest first"; inverted date ranges are rejected by a zod refinement.

## Where
ledger/src/domain/repositories/ITransactionRepository.ts, infrastructure/repositories/PrismaTransactionRepository.ts
