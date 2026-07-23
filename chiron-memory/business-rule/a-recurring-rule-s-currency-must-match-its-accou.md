---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-10
type: business-rule
title: A recurring rule's currency must match its account's currency, enforced in…
tags: [business-rule]
created: 2026-07-23
resource: src/application/use-cases/CreateRecurringRuleUseCase.ts
---
A recurring rule's currency must match its account's currency, enforced in CreateRecurringRuleUseCase

## Why
keeps the same single-currency-per-account invariant for materialized recurring transactions

## Where
src/application/use-cases/CreateRecurringRuleUseCase.ts
