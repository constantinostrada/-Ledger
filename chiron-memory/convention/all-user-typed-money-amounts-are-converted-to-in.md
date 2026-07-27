---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-7
type: convention
title: All user-typed money amounts are converted to integer cents via a single helper…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/moneyInput.ts
---
All user-typed money amounts are converted to integer cents via a single helper (`parseAmountToCents` in moneyInput.ts) that parses the decimal string directly — never via `value * 100` — to avoid floating-point rounding errors

## Where
src/interfaces/web/moneyInput.ts
