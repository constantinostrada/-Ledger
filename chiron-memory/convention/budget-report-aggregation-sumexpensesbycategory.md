---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-14
type: convention
title: Budget/report aggregation (sumExpensesByCategory) sums base_amount_cents rather than…
tags: [convention]
created: 2026-07-23
resource: src/infrastructure/repositories/PrismaTransactionRepository.ts, src/application/use-cases/GetBudgetsUseCase.ts
---
Budget/report aggregation (sumExpensesByCategory) sums base_amount_cents rather than amount_cents

## Why
a spending category can span accounts in different currencies, so aggregating the original amount_cents would mix currencies incorrectly

## Where
src/infrastructure/repositories/PrismaTransactionRepository.ts, src/application/use-cases/GetBudgetsUseCase.ts
