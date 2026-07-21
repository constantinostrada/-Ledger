---
type: convention
title: Domain entities (Account, Transaction, Category) use a private constructor plus two static factories: `create()` for brand-new entities (sets timestamps/defaults) and `reconstitute()` for rehydrating from persistence.
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/{Account,Transaction,Category}.ts.
---
Domain entities (Account, Transaction, Category) use a private constructor plus two static factories: `create()` for brand-new entities (sets timestamps/defaults) and `reconstitute()` for rehydrating from persistence.

## Where
src/domain/entities/{Account,Transaction,Category}.ts.
