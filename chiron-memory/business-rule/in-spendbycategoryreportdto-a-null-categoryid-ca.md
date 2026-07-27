---
id: 11534d18-840b-4b92-ab1b-9192ecb0a99d-4
type: business-rule
title: In SpendByCategoryReportDTO, a null categoryId/categoryName represents expenses with no…
tags: [business-rule]
created: 2026-07-27
resource: src/application/dtos/SpendByCategoryReportDTO.ts, reports page.
---
In SpendByCategoryReportDTO, a null categoryId/categoryName represents expenses with no assigned category, and the Reports UI renders these as their own 'uncategorized' row rather than dropping them

## Where
src/application/dtos/SpendByCategoryReportDTO.ts, reports page.
