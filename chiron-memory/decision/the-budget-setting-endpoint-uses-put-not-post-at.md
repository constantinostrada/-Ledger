---
id: 78622e61-4fce-40f0-af8d-d9c475184740-9
type: decision
title: The budget-setting endpoint uses PUT (not POST) at /api/budgets, deliberately signaling…
tags: [decision]
created: 2026-07-22
resource: src/app/api/budgets/route.ts.
---
The budget-setting endpoint uses PUT (not POST) at /api/budgets, deliberately signaling idempotent set-semantics for the category+period upsert rather than POST's create-a-new-resource connotation.

## Where
src/app/api/budgets/route.ts.
