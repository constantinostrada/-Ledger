---
id: 11534d18-840b-4b92-ab1b-9192ecb0a99d-3
type: convention
title: apiClient.ts methods added for reports (getSpendByCategoryReport,…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/apiClient.ts.
---
apiClient.ts methods added for reports (getSpendByCategoryReport, getIncomeVsExpenseReport) are typed only against application-layer DTOs, never domain entities, consistent with the rest of the client

## Where
src/interfaces/web/apiClient.ts.
