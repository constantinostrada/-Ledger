---
id: 3df2f590-37db-4403-a807-c757fa71fd79-3
type: architecture
title: Domain Account.balance is a hydrated read-only snapshot populated by the repository from…
tags: [architecture]
created: 2026-07-22
resource: src/domain/entities/Account.ts, src/infrastructure/repositories/PrismaAccountRepository.ts.
---
Domain Account.balance is a hydrated read-only snapshot populated by the repository from aggregated transactions, not an entity-owned/settable field; canDebit and insufficient-funds checks run against this true derived value.

## Where
src/domain/entities/Account.ts, src/infrastructure/repositories/PrismaAccountRepository.ts.
