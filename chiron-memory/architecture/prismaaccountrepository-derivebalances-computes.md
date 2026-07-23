---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-13
type: architecture
title: PrismaAccountRepository.deriveBalances computes both the original-currency balance and…
tags: [architecture]
created: 2026-07-23
resource: src/infrastructure/repositories/PrismaAccountRepository.ts
---
PrismaAccountRepository.deriveBalances computes both the original-currency balance and the base-currency balance in a single groupBy query, labeling the base amount with the user's base currency via the account→user relation

## Why
avoids N+1 queries or a second aggregation pass per account

## Where
src/infrastructure/repositories/PrismaAccountRepository.ts
