---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-5
type: convention
title: Use cases that accept a categoryId (CreateTransactionUseCase, CreateRecurringRuleUseCase,…
tags: [convention]
created: 2026-07-23
resource: src/application/use-cases/CreateTransactionUseCase.ts, CreateRecurringRuleUseCase.ts, SetBudgetUseCase.ts.
---
Use cases that accept a categoryId (CreateTransactionUseCase, CreateRecurringRuleUseCase, SetBudgetUseCase) enforce category ownership by masking a foreign/nonexistent category as a generic 'not found' error, the same pattern already used for account ownership checks.

## Where
src/application/use-cases/CreateTransactionUseCase.ts, CreateRecurringRuleUseCase.ts, SetBudgetUseCase.ts.
