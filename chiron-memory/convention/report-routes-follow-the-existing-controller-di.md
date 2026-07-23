---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-9
type: convention
title: Report routes follow the existing controller/DI pattern
tags: [convention]
created: 2026-07-23
resource: src/interfaces/controllers/ReportController.ts, src/interfaces/validation/reportSchemas.ts, src/app/api/reports/*/route.ts
---
Report routes follow the existing controller/DI pattern: GET /api/reports/spend-by-category?period=YYYY-MM, /api/reports/income-vs-expense?from=YYYY-MM&to=YYYY-MM, /api/reports/net-worth, all requiring a Bearer token (401 if missing), with User not found mapped to 404 and validation errors to 400

## Where
src/interfaces/controllers/ReportController.ts, src/interfaces/validation/reportSchemas.ts, src/app/api/reports/*/route.ts
