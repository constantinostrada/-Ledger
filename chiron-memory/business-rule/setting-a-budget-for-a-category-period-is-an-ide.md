---
id: 78622e61-4fce-40f0-af8d-d9c475184740-2
type: business-rule
title: Setting a budget for a category+period is an idempotent upsert (PUT /api/budgets, 200)
tags: [business-rule]
created: 2026-07-22
resource: SetBudgetUseCase, src/app/api/budgets/route.ts.
---
Setting a budget for a category+period is an idempotent upsert (PUT /api/budgets, 200) — re-setting a limit updates the existing budget row rather than creating a duplicate.

## Where
SetBudgetUseCase, src/app/api/budgets/route.ts.
