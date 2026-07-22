---
id: 78622e61-4fce-40f0-af8d-d9c475184740-17
type: architecture
title: RecurringRule.dueDatesThrough(asOf) generates all occurrence dates from start_date…
tags: [architecture]
created: 2026-07-22
resource: src/domain/entities/RecurringRule.ts, src/application/use-cases/MaterializeRecurringTransactionsUseCase.ts.
---
RecurringRule.dueDatesThrough(asOf) generates all occurrence dates from start_date through the current time; MaterializeRecurringTransactionsUseCase (the "sweep") builds one candidate Transaction per due date per rule and bulk-inserts them all at once with duplicate-skipping.

## Where
src/domain/entities/RecurringRule.ts, src/application/use-cases/MaterializeRecurringTransactionsUseCase.ts.
