---
id: 1b45f9d3-0d05-4fe5-9787-8cc7377ebcb9
type: gotcha
title: Prisma migrate dev interactive prompts block non-interactive sessions
tags: [gotcha]
created: 2026-07-23
resource: prisma/schema.prisma, prisma/migrations/20260723000000_categories_per_user/migration.sql, README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md, PROJECT_SUMMARY.md
---
Prisma migrate dev interactive prompts block non-interactive sessions

## Why
migrate dev hangs or fails in automated/agent workflows when schema changes are destructive or add constraints

## Learned
`prisma migrate dev` prompts interactively when dropping columns with data, adding unique/required constraints, or detecting unresolvable drift, hanging non-interactive sessions · workaround: generate SQL with `prisma migrate diff --from-url ... --to-schema-datamodel ...` into the migration folder, then apply with `prisma migrate deploy` · alternative: use `prisma migrate dev --create-only` to generate the migration file, hand-edit if needed, then deploy · adding a required FK column (e.g. Account.userId, Category.userId) to a populated table requires either backfilling a default value or truncating the table first — Prisma will not silently handle orphaned rows · when replacing an infra script (e.g. `npm run db:migrate` → `npm run prisma:migrate`), grep the entire docs tree for the old command name, not just source code, to avoid stale instructions pointing at removed commands

## Where
prisma/schema.prisma, prisma/migrations/20260723000000_categories_per_user/migration.sql, README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md, PROJECT_SUMMARY.md
