---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-4
type: business-rule
title: CreateTransactionUseCase validates that a linked category exists and is owned by the…
tags: [business-rule]
created: 2026-07-23
---
CreateTransactionUseCase validates that a linked category exists and is owned by the user, but does NOT check that the category's 'kind' matches the transaction type (income/expense).

## Learned
an earlier draft of docs/API.md incorrectly claimed this cross-check existed; verify use-case behavior directly rather than assuming from field names.
