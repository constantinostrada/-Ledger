---
id: 3df2f590-37db-4403-a807-c757fa71fd79-1
type: convention
title: On account creation, `initialBalanceCents` is materialized as an 'Opening balance' CREDIT transaction rather than written to a balance field; the transaction schema rejects negative amounts.
tags: [convention]
created: 2026-07-22
resource: CreateAccountUseCase, prisma/seed.ts (seed accounts carry no balance field, only opening-balance transactions).
---
On account creation, `initialBalanceCents` is materialized as an 'Opening balance' CREDIT transaction rather than written to a balance field; the transaction schema rejects negative amounts.

## Where
CreateAccountUseCase, prisma/seed.ts (seed accounts carry no balance field, only opening-balance transactions).
