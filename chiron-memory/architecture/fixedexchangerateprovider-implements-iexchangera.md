---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-12
type: architecture
title: FixedExchangeRateProvider implements IExchangeRateProvider using a static USD-pivot rate…
tags: [architecture]
created: 2026-07-23
resource: src/infrastructure/exchange-rates/FixedExchangeRateProvider.ts
---
FixedExchangeRateProvider implements IExchangeRateProvider using a static USD-pivot rate table

## Why
placeholder infra so a live-rate client can later drop in behind the same port without touching domain/application code

## Where
src/infrastructure/exchange-rates/FixedExchangeRateProvider.ts
