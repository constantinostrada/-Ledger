---
type: convention
title: Transaction entity now enforces a positive-amount invariant — `Transaction.create()`/`reconstitute()` throws if the amount is not positive — in addition to the new optional `categoryId`.
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/Transaction.ts.
---
Transaction entity now enforces a positive-amount invariant — `Transaction.create()`/`reconstitute()` throws if the amount is not positive — in addition to the new optional `categoryId`.

## Where
src/domain/entities/Transaction.ts.
