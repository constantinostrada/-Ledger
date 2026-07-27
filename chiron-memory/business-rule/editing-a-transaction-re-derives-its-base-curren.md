---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-1
type: business-rule
title: Editing a transaction re-derives its base-currency snapshot (baseAmountCents) via…
tags: [business-rule]
created: 2026-07-27
resource: src/application/use-cases/UpdateTransactionUseCase.ts.
---
Editing a transaction re-derives its base-currency snapshot (baseAmountCents) via BaseCurrencyConverter at edit time, using the same conversion path as original posting, rather than preserving the value from creation.

## Why
keeps the base-currency amount consistent with current conversion logic instead of going stale after an edit.

## Where
src/application/use-cases/UpdateTransactionUseCase.ts.
