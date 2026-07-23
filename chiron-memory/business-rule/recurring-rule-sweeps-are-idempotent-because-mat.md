---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-2
type: business-rule
title: Recurring rule sweeps are idempotent because materialized transactions are constrained by…
tags: [business-rule]
created: 2026-07-23
resource: prisma/schema.prisma, recurring-rules sweep route/use case
---
Recurring rule sweeps are idempotent because materialized transactions are constrained by a DB unique index on (rule, date); re-running a sweep reports createdCount: 0 and a raw duplicate insert throws Prisma P2002 rather than creating a duplicate.

## Why
the idempotency guarantee lives at the DB layer, not just in application logic.

## Where
prisma/schema.prisma, recurring-rules sweep route/use case
