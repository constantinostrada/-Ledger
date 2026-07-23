---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-1
type: architecture
title: ITransactionRepository exposes two read-side aggregate methods,…
tags: [architecture]
created: 2026-07-23
resource: src/domain/repositories/ITransactionRepository.ts, src/infrastructure/repositories/PrismaTransactionRepository.ts
---
ITransactionRepository exposes two read-side aggregate methods, sumExpensesGroupedByCategory and sumByTypePerMonth, both returning base-currency integer cents

## Why
reporting is pure read-side computation with no persistence, so aggregation logic lives behind the repository interface rather than in use cases

## Where
src/domain/repositories/ITransactionRepository.ts, src/infrastructure/repositories/PrismaTransactionRepository.ts
