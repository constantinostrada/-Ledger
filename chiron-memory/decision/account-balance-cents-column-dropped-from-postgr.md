---
id: 3df2f590-37db-4403-a807-c757fa71fd79-0
type: decision
title: Account.balance_cents column dropped from Postgres schema
tags: [decision]
created: 2026-07-22
resource: prisma/schema.prisma, src/infrastructure/repositories/PrismaAccountRepository.ts, migration 20260722000000_derive_account_balance.
---
Account.balance_cents column dropped from Postgres schema; balance is now computed as credits−debits via a Prisma groupBy aggregate over transactions in PrismaAccountRepository.

## Why
a stored balance could drift from its transactions — CreateTransactionUseCase validated against the stored balance but never updated it, a latent bug this eliminates by construction.

## Where
prisma/schema.prisma, src/infrastructure/repositories/PrismaAccountRepository.ts, migration 20260722000000_derive_account_balance.
