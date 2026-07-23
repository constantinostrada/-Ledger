---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-8
type: decision
title: Transactions store both the original amount/currency and a…
tags: [decision]
created: 2026-07-23
resource: prisma/schema.prisma Transaction model, src/domain/entities/Transaction.ts, src/application/services/BaseCurrencyConverter.ts
---
Transactions store both the original amount/currency and a base_amount_cents/base_currency snapshot converted at posting time

## Why
so budget/report aggregates never need to re-convert or depend on historical exchange rates changing

## Where
prisma/schema.prisma Transaction model, src/domain/entities/Transaction.ts, src/application/services/BaseCurrencyConverter.ts
