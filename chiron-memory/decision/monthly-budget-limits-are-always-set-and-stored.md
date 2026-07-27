---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-0
type: decision
title: Monthly budget limits are always set and stored in the user's base currency, not a…
tags: [decision]
created: 2026-07-27
resource: src/application/use-cases/SetBudgetUseCase.ts, src/application/dtos/SetBudgetDTO.ts
---
Monthly budget limits are always set and stored in the user's base currency, not a per-category or per-account currency

## Why
spent/remaining totals aggregate base-currency transaction snapshots, so a budget limit in any other currency couldn't be compared consistently

## Where
src/application/use-cases/SetBudgetUseCase.ts, src/application/dtos/SetBudgetDTO.ts
