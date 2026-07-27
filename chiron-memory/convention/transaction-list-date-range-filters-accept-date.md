---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-6
type: convention
title: Transaction list date-range filters accept date-only (day-level) inputs from the UI and…
tags: [convention]
created: 2026-07-27
resource: src/app/(authenticated)/transactions/page.tsx filter handling → GetTransactionsDTO/TransactionFilter.
---
Transaction list date-range filters accept date-only (day-level) inputs from the UI and convert them to UTC day boundaries (start/end of day) at the query edge.

## Where
src/app/(authenticated)/transactions/page.tsx filter handling → GetTransactionsDTO/TransactionFilter.
