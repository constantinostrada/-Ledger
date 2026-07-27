---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-0
type: business-rule
title: A transaction's currency must always match the currency of the account it posts to,…
tags: [business-rule]
created: 2026-07-27
resource: src/domain/services/TransactionService.ts.
---
A transaction's currency must always match the currency of the account it posts to, enforced in TransactionService.

## Why
keeps posted amounts unambiguous per account rather than allowing mixed-currency ledgers.

## Learned
transaction add/edit forms must derive currency from the selected account (read-only, shown as a label) instead of letting the user pick it independently.

## Where
src/domain/services/TransactionService.ts.
