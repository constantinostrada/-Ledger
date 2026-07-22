---
id: 78622e61-4fce-40f0-af8d-d9c475184740-12
type: decision
title: Recurring-transaction materialization idempotency is enforced by a DB-level unique…
tags: [decision]
created: 2026-07-22
resource: prisma/schema.prisma migration add_recurring_rules; src/domain/repositories/ITransactionRepository.ts (saveAllIgnoringDuplicates).
---
Recurring-transaction materialization idempotency is enforced by a DB-level unique constraint on transactions(recurring_rule_id, date) rather than an application check-then-insert.

## Why
Mirrors how the earlier B3 balance-drift work made an invalid state impossible by construction rather than by validation, avoiding race conditions on repeated/concurrent sweeps.

## Where
prisma/schema.prisma migration add_recurring_rules; src/domain/repositories/ITransactionRepository.ts (saveAllIgnoringDuplicates).
