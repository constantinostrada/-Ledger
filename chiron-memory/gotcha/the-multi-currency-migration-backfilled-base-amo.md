---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-17
type: gotcha
title: The multi-currency migration backfilled base_amount_cents/base_currency on all…
tags: [gotcha]
created: 2026-07-23
resource: prisma/migrations/20260723100000_multi_currency/migration.sql
---
The multi-currency migration backfilled base_amount_cents/base_currency on all pre-existing transaction rows 1:1, since all prior data was USD-only

## Why
needed to know before touching historical transaction data — assuming a non-1:1 backfill was needed would be wrong

## Where
prisma/migrations/20260723100000_multi_currency/migration.sql
