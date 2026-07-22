---
id: 3df2f590-37db-4403-a807-c757fa71fd79-13
type: convention
title: Extracted a shared `transactionMapper` (application/mappers/transactionMapper.ts) mirroring the existing `accountMapper` pattern, and made `TransactionController` thin like `AccountController` by removing generic `Failed to …:` error-wrapping so the route layer can map specific errors ("Account not found", "Category not found") to the correct HTTP status (404).
tags: [convention]
created: 2026-07-22
resource: ledger/src/application/mappers/transactionMapper.ts, interfaces/controllers/TransactionController.ts
---
Extracted a shared `transactionMapper` (application/mappers/transactionMapper.ts) mirroring the existing `accountMapper` pattern, and made `TransactionController` thin like `AccountController` by removing generic `Failed to …:` error-wrapping so the…

## Learned
Keep controllers thin — error-to-status mapping belongs in the route handler, not swallowed/rewrapped in the controller.

## Where
ledger/src/application/mappers/transactionMapper.ts, interfaces/controllers/TransactionController.ts
