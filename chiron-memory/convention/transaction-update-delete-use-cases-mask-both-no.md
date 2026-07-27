---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-2
type: convention
title: Transaction update/delete use cases mask both 'not found' and 'belongs to another user'…
tags: [convention]
created: 2026-07-27
resource: src/application/use-cases/UpdateTransactionUseCase.ts, DeleteTransactionUseCase.ts, TransactionController.ts.
---
Transaction update/delete use cases mask both 'not found' and 'belongs to another user' cases behind the identical error message/shape ('Transaction not found'), resolving ownership through the transaction's account.

## Why
avoids leaking existence of other users' records via distinguishable error responses.

## Where
src/application/use-cases/UpdateTransactionUseCase.ts, DeleteTransactionUseCase.ts, TransactionController.ts.
