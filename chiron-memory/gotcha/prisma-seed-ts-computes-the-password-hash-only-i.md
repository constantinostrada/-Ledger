---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-17
type: gotcha
title: prisma/seed.ts computes the password hash only inside the user-create branch, not…
tags: [gotcha]
created: 2026-07-21
resource: prisma/seed.ts
---
prisma/seed.ts computes the password hash only inside the user-create branch, not unconditionally

## Why
keeps re-running the seed idempotent — verified two consecutive `npm run prisma:seed` runs produced identical row counts (1 user, 2 accounts, 4 transactions) instead of duplicating or re-hashing

## Learned
guard expensive/non-idempotent side effects (hashing, external calls) behind the same existence check used for the row upsert, not run them unconditionally before the check.

## Where
prisma/seed.ts
