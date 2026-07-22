---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-13
type: convention
title: When a resource (account/transaction) doesn't belong to the requesting user, use cases…
tags: [convention]
created: 2026-07-21
resource: CreateTransactionUseCase, GetTransactionsUseCase
---
When a resource (account/transaction) doesn't belong to the requesting user, use cases return "Account not found" rather than a 403/forbidden

## Why
avoids leaking the existence of other users' resources

## Learned
cross-tenant/cross-user access checks should look identical to a genuine not-found case.

## Where
CreateTransactionUseCase, GetTransactionsUseCase
