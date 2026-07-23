---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-0
type: business-rule
title: Cross-user access to another user's resources (accounts, transactions, categories,…
tags: [business-rule]
created: 2026-07-23
resource: src/application/use-cases/*.ts
---
Cross-user access to another user's resources (accounts, transactions, categories, budgets, recurring rules) always returns 404, never 403.

## Why
avoids leaking whether a resource exists to non-owners; confirmed by grepping 'not found' throws across GetTransactionsUseCase, UpdateAccountUseCase, SetBudgetUseCase, CreateTransactionUseCase.

## Where
src/application/use-cases/*.ts
