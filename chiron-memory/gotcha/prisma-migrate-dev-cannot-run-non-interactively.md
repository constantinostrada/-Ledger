---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-7
type: gotcha
title: `prisma migrate dev` cannot run non-interactively in this environment (fails when it…
tags: [gotcha]
created: 2026-07-23
resource: prisma/migrations/20260723000000_categories_per_user/migration.sql.
---
`prisma migrate dev` cannot run non-interactively in this environment (fails when it detects destructive/unresolvable schema drift), so migrations that require custom logic (e.g. deleting old ownerless rows before adding a required FK) must be generated with `--create-only` or hand-authored directly under prisma/migrations/, then applied with `prisma migrate deploy`.

## Why
hit this again when adding the required userId FK to the pre-existing global Category table, same shape as the earlier Account FK migration.

## Where
prisma/migrations/20260723000000_categories_per_user/migration.sql.
