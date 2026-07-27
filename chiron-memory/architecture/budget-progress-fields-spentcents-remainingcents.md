---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-1
type: architecture
title: Budget progress fields (spentCents, remainingCents, percentUsed, overBudget) are computed…
tags: [architecture]
created: 2026-07-27
resource: src/application/dtos/BudgetDTO.ts, src/application/use-cases/GetBudgetsUseCase.ts
---
Budget progress fields (spentCents, remainingCents, percentUsed, overBudget) are computed at read time from the period's transactions and never persisted on the Budget entity

## Why
storing derived totals would let them drift out of sync with actual transactions; recomputing on read guarantees correctness

## Where
src/application/dtos/BudgetDTO.ts, src/application/use-cases/GetBudgetsUseCase.ts
