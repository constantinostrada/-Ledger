---
id: 78622e61-4fce-40f0-af8d-d9c475184740-0
type: decision
title: Budgets do not store a spent_cents column
tags: [decision]
created: 2026-07-22
resource: prisma/schema.prisma budgets table, PrismaTransactionRepository.sumExpensesByCategory.
---
Budgets do not store a spent_cents column; spent is always computed on-the-fly from period transactions, mirroring B3's derived-balance approach.

## Why
keeps spent-vs-limit consistent with the transaction ledger as the single source of truth instead of a value that can drift out of sync.

## Where
prisma/schema.prisma budgets table, PrismaTransactionRepository.sumExpensesByCategory.
