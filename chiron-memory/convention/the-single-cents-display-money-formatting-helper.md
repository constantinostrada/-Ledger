---
id: 35a2fb67-9056-4df0-8bd8-cb93a461ca6c-0
type: convention
title: The single cents→display money-formatting helper for the UI lives at…
tags: [convention]
created: 2026-07-24
resource: src/interfaces/web/formatMoney.ts, consumed by src/app/(authenticated)/dashboard/page.tsx
---
The single cents→display money-formatting helper for the UI lives at src/interfaces/web/formatMoney.ts (formatMoney(cents, currency) via Intl.NumberFormat)

## Why
dashboard previously had its own local copy of this logic, which the acceptance criteria required to be unified into one helper

## Learned
any future UI code displaying money must import this helper rather than reimplementing cents formatting.

## Where
src/interfaces/web/formatMoney.ts, consumed by src/app/(authenticated)/dashboard/page.tsx
