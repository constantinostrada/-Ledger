---
id: 11534d18-840b-4b92-ab1b-9192ecb0a99d-1
type: convention
title: All cents-to-display currency conversion goes through the shared formatMoney helper
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/formatMoney.ts.
---
All cents-to-display currency conversion goes through the shared formatMoney helper; a formatMoneyWhole variant was added to it (rounds, no fraction digits) for chart axis ticks rather than writing a separate ad-hoc formatter

## Where
src/interfaces/web/formatMoney.ts.
