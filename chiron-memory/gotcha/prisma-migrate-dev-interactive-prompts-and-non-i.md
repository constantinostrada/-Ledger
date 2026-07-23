---
id: a81ea682-dc68-46fa-baba-e0879bd63919
type: gotcha
title: Prisma migrate dev interactive prompts and non-interactive workarounds
tags: [gotcha]
created: 2026-07-23
resource: prisma/schema.prisma, README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md, PROJECT_SUMMARY.md
---
Prisma migrate dev interactive prompts and non-interactive workarounds

## Why
migrate dev hangs or fails in automated/agent sessions when schema changes are destructive or add constraints

## Learned
`prisma migrate dev` prompts interactively when dropping columns with data or adding unique/required constraints that may conflict, hanging non-interactive sessions · workaround: generate SQL with `prisma migrate diff --from-url ... --to-schema-datamodel ...` into the migration folder, then apply with `prisma migrate deploy` · adding a required FK column (e.g. Account.userId) to a populated table requires either backfilling a default value or truncating the table first — Prisma will not silently handle orphaned rows · when replacing an infra script (e.g. `npm run db:migrate` → `npm run prisma:migrate`), grep the entire docs tree for the old command name, not just source code, to avoid stale instructions pointing at removed commands

## Where
prisma/schema.prisma, README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md, PROJECT_SUMMARY.md
