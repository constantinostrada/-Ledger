---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-8
type: gotcha
title: Domain services (not just entities) directly instantiate value objects
tags: [gotcha]
created: 2026-07-21
resource: src/domain/services/TransactionService.ts.
---
Domain services (not just entities) directly instantiate value objects — `TransactionService` called `new Money(0)` — so when Money's constructor was made private in favor of `Money.fromCents()`, this call site needed a manual fix alongside the entity rewrites.

## Why
it wasn't caught by grepping entities alone; found only when editing the domain layer broadly.

## Learned
when changing a value object's public API, grep all of src/domain/ (services included) for direct constructor usage, not just the entities that own it.

## Where
src/domain/services/TransactionService.ts.
