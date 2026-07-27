---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-2
type: convention
title: Setting a budget (PUT /api/budgets) is an idempotent upsert keyed by (categoryId, period)…
tags: [convention]
created: 2026-07-27
resource: src/application/dtos/SetBudgetDTO.ts, src/interfaces/controllers/BudgetController.ts
---
Setting a budget (PUT /api/budgets) is an idempotent upsert keyed by (categoryId, period) per authenticated user — first call creates the limit, later calls for the same category/month replace it

## Where
src/application/dtos/SetBudgetDTO.ts, src/interfaces/controllers/BudgetController.ts
