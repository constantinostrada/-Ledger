---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-0
type: architecture
title: BudgetPeriod value object was extended with next(), monthsUntil(), and isAfter() methods…
tags: [architecture]
created: 2026-07-23
resource: src/domain/value-objects/BudgetPeriod.ts
---
BudgetPeriod value object was extended with next(), monthsUntil(), and isAfter() methods rather than introducing a new month/period type for reports

## Why
reuse the existing month value object instead of adding a parallel abstraction

## Where
src/domain/value-objects/BudgetPeriod.ts
