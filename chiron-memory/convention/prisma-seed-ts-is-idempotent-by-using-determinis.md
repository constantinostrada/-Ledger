---
type: convention
title: prisma/seed.ts is idempotent by using deterministic ids plus upserts.
tags: [convention]
created: 2026-07-21
---
prisma/seed.ts is idempotent by using deterministic ids plus upserts.

## Learned
verified by running `npm run prisma:seed` twice in a row and confirming row counts stayed fixed (5 categories / 2 accounts / 4 transactions) rather than duplicating.
