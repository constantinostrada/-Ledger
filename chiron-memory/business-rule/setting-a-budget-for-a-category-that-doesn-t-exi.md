---
id: 78622e61-4fce-40f0-af8d-d9c475184740-8
type: business-rule
title: Setting a budget for a category that doesn't exist is rejected
tags: [business-rule]
created: 2026-07-22
resource: SetBudgetUseCase.ts, src/app/api/budgets/route.ts.
---
Setting a budget for a category that doesn't exist is rejected — SetBudgetUseCase checks category existence via ICategoryRepository before upserting, returning 404 rather than silently creating an orphaned budget.

## Where
SetBudgetUseCase.ts, src/app/api/budgets/route.ts.
