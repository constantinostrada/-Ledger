---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-7
type: gotcha
title: There is no single shared test double for ITransactionRepository
tags: [gotcha]
created: 2026-07-27
resource: tests/recurring-transactions.test.ts, tests/reports.test.ts, tests/multi-currency.test.ts.
---
There is no single shared test double for ITransactionRepository — separate FakeTransactionRepository/StubTransactionRepository classes are duplicated across recurring-transactions.test.ts, reports.test.ts, and multi-currency.test.ts.

## Learned
adding a new method to ITransactionRepository (e.g. update) requires updating all three fakes individually or tsc fails with 'incorrectly implements interface'.

## Where
tests/recurring-transactions.test.ts, tests/reports.test.ts, tests/multi-currency.test.ts.
