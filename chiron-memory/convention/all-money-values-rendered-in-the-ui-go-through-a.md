---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-8
type: convention
title: All money values rendered in the UI go through a single cents→display helper…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/formatMoney.ts
---
All money values rendered in the UI go through a single cents→display helper (`formatMoney.ts`); division by 100 happens nowhere else in the codebase

## Where
src/interfaces/web/formatMoney.ts
