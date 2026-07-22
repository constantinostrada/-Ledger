---
id: 78622e61-4fce-40f0-af8d-d9c475184740-6
type: convention
title: Budget math (remaining(spent), percentUsed(spent), isOverBudget(spent)) is implemented as…
tags: [convention]
created: 2026-07-22
resource: src/domain/entities/Budget.ts.
---
Budget math (remaining(spent), percentUsed(spent), isOverBudget(spent)) is implemented as methods on the Budget entity, not in the use case or a mapper.

## Where
src/domain/entities/Budget.ts.
