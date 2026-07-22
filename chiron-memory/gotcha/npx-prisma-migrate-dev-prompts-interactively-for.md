---
id: 3df2f590-37db-4403-a807-c757fa71fd79-6
type: gotcha
title: `npx prisma migrate dev` prompts interactively for confirmation when a migration drops a column with existing data, which hangs in a non-interactive agent session.
tags: [gotcha]
created: 2026-07-22
---
`npx prisma migrate dev` prompts interactively for confirmation when a migration drops a column with existing data, which hangs in a non-interactive agent session.

## Learned
for destructive schema changes in this workflow, hand-author the migration.sql file and apply it non-interactively with `npx prisma migrate deploy` instead of `migrate dev`.
