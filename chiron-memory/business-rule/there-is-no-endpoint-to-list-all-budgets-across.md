---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-4
type: business-rule
title: There is no endpoint to list all budgets across months
tags: [business-rule]
created: 2026-07-27
resource: src/application/dtos/GetBudgetsDTO.ts, src/interfaces/web/apiClient.ts (getBudgets)
---
There is no endpoint to list all budgets across months — GetBudgetsDTO requires a specific period (YYYY-MM), so the UI/client always fetches one month's budgets at a time

## Where
src/application/dtos/GetBudgetsDTO.ts, src/interfaces/web/apiClient.ts (getBudgets)
