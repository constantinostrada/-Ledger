---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-7
type: architecture
title: Cross-currency transactions are converted at write time via FixedExchangeRateProvider…
tags: [architecture]
created: 2026-07-23
resource: src/infrastructure/exchange-rates/FixedExchangeRateProvider.ts
---
Cross-currency transactions are converted at write time via FixedExchangeRateProvider (through a USD pivot) and the result is stored as a baseAmountCents snapshot, not recomputed later on read.

## Where
src/infrastructure/exchange-rates/FixedExchangeRateProvider.ts
