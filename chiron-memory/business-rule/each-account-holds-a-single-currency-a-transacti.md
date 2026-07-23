---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-9
type: business-rule
title: Each account holds a single currency
tags: [business-rule]
created: 2026-07-23
resource: src/domain/services/TransactionService.ts
---
Each account holds a single currency; a transaction's currency must match its account's currency or TransactionService rejects it

## Why
cross-currency values only make sense after conversion to the user's base currency, not at the account level

## Where
src/domain/services/TransactionService.ts
