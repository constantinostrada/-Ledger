---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-2
type: convention
title: Domain entities (Account, Transaction, Category) use a private constructor plus two…
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/{Account,Transaction,Category}.ts.
---
Domain entities (Account, Transaction, Category) use a private constructor plus two static factories: `create()` for brand-new entities (sets timestamps/defaults) and `reconstitute()` for rehydrating from persistence.

## Where
src/domain/entities/{Account,Transaction,Category}.ts.
