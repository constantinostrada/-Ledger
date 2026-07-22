---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-1
type: convention
title: Money value object stores only integer cents
tags: [convention]
created: 2026-07-21
resource: src/domain/value-objects/Money.ts.
---
Money value object stores only integer cents; constructor is private and callers must use `Money.fromCents(cents)` (plus `Money.zero()`), which throws via `Number.isSafeInteger` on floats, NaN, and Infinity.

## Learned
verified with a 13-check smoke test (Money.fromCents(10.5), NaN, Infinity all throw).

## Where
src/domain/value-objects/Money.ts.
