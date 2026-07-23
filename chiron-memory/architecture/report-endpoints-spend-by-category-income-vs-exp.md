---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-8
type: architecture
title: Report endpoints (spend-by-category, income-vs-expense, net-worth) each resolve the…
tags: [architecture]
created: 2026-07-23
resource: src/application/use-cases/GetSpendByCategoryReportUseCase.ts, GetIncomeVsExpenseReportUseCase.ts, GetNetWorthReportUseCase.ts
---
Report endpoints (spend-by-category, income-vs-expense, net-worth) each resolve the user's base currency once and perform a single aggregate query per use case, avoiding N+1 queries

## Where
src/application/use-cases/GetSpendByCategoryReportUseCase.ts, GetIncomeVsExpenseReportUseCase.ts, GetNetWorthReportUseCase.ts
