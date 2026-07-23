---
id: 2bd61590-3827-4db5-b247-eec6e76417e6-5
type: business-rule
title: Net worth report includes archived accounts in the total, not just active ones
tags: [business-rule]
created: 2026-07-23
resource: src/application/use-cases/GetNetWorthReportUseCase.ts
---
Net worth report includes archived accounts in the total, not just active ones

## Why
archived/inactive accounts still hold funds and must count toward net worth

## Where
src/application/use-cases/GetNetWorthReportUseCase.ts
