---
id: 78622e61-4fce-40f0-af8d-d9c475184740-5
type: convention
title: Budget period validation and month-boundary math (UTC start / end-exclusive) live in a…
tags: [convention]
created: 2026-07-22
resource: src/domain/value-objects/BudgetPeriod.ts.
---
Budget period validation and month-boundary math (UTC start / end-exclusive) live in a dedicated BudgetPeriod value object rather than being inlined in the use case or repository.

## Where
src/domain/value-objects/BudgetPeriod.ts.
