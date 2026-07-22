---
id: 78622e61-4fce-40f0-af8d-d9c475184740-13
type: convention
title: Bulk idempotent inserts go through ITransactionRepository.saveAllIgnoringDuplicates(),…
tags: [convention]
created: 2026-07-22
resource: src/infrastructure/repositories/PrismaTransactionRepository.ts.
---
Bulk idempotent inserts go through ITransactionRepository.saveAllIgnoringDuplicates(), implemented in Prisma via createMany({skipDuplicates: true}) which compiles to ON CONFLICT DO NOTHING against the relevant unique index, returning the count actually inserted.

## Where
src/infrastructure/repositories/PrismaTransactionRepository.ts.
