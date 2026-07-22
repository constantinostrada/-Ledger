---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-9
type: convention
title: Transaction entity now enforces a positive-amount invariant — `Transaction.create()`/`reconstitute()` throws if the amount is not positive — in addition to the new optional `categoryId`.
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/Transaction.ts.
---
Transaction entity now enforces a positive-amount invariant — `Transaction.create()`/`reconstitute()` throws if the amount is not positive — in addition to the new optional `categoryId`.

## Where
src/domain/entities/Transaction.ts.
