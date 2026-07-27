---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-4
type: convention
title: Converting a user-typed decimal amount to integer cents at the UI edge is done via direct…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/moneyInput.ts (parseAmountToCents / centsToAmountInput).
---
Converting a user-typed decimal amount to integer cents at the UI edge is done via direct string parsing of the decimal (splitting integer/fraction parts), not by multiplying the float by 100.

## Why
float multiplication (e.g. 0.29 * 100) introduces rounding drift; string-based parsing avoids it and rejects zero/negative/>2-decimal inputs at the boundary.

## Where
src/interfaces/web/moneyInput.ts (parseAmountToCents / centsToAmountInput).
