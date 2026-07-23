---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-11
type: architecture
title: An IExchangeRateProvider port plus a BaseCurrencyConverter application service is shared…
tags: [architecture]
created: 2026-07-23
resource: src/application/ports/IExchangeRateProvider.ts, src/application/services/BaseCurrencyConverter.ts
---
An IExchangeRateProvider port plus a BaseCurrencyConverter application service is shared by all three transaction-creating use cases (CreateTransaction, CreateAccount's opening balance, and the recurring sweep)

## Why
single place to fetch a rate and convert to base currency, avoiding duplicated conversion logic per use case

## Where
src/application/ports/IExchangeRateProvider.ts, src/application/services/BaseCurrencyConverter.ts
