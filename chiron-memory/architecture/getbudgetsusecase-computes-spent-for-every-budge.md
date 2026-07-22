---
id: 78622e61-4fce-40f0-af8d-d9c475184740-10
type: architecture
title: GetBudgetsUseCase computes spent for every budget in a requested period with a single…
tags: [architecture]
created: 2026-07-22
resource: GetBudgetsUseCase.ts.
---
GetBudgetsUseCase computes spent for every budget in a requested period with a single batched sumExpensesByCategory call (passing all categoryIds at once) rather than one aggregate query per budget, avoiding N+1 queries when listing a month's budgets.

## Where
GetBudgetsUseCase.ts.
