---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-12
type: convention
title: userId is never accepted from client input (DTOs/body/query) for scoped resources
tags: [convention]
created: 2026-07-21
resource: CreateAccountDTO (userId field removed), CreateAccountUseCase, CreateTransactionUseCase, GetTransactionsUseCase, authenticateRequest() in src/interfaces/auth/authenticateRequest.ts
---
userId is never accepted from client input (DTOs/body/query) for scoped resources — it's always the authenticated identity passed as an explicit first argument to use cases

## Why
prevents a client from spoofing another user's id to create/access resources on their behalf

## Learned
token-derived identity is the single source of truth for ownership; zod schemas must not include userId so a spoofed value in the body is stripped before it reaches the use case.

## Where
CreateAccountDTO (userId field removed), CreateAccountUseCase, CreateTransactionUseCase, GetTransactionsUseCase, authenticateRequest() in src/interfaces/auth/authenticateRequest.ts
