---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-7
type: gotcha
title: Several project docs (README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md,…
tags: [gotcha]
created: 2026-07-21
---
Several project docs (README.md, QUICKSTART.md, docs/EXAMPLES.md, CHECKLIST.md, PROJECT_SUMMARY.md) still referenced the old `npm run db:migrate` script from the pg-based setup after the Prisma migration; they were bulk sed-updated to `npm run prisma:migrate`.

## Learned
when replacing an infra script/tool (e.g. pg → Prisma), grep the docs tree for the old script name, not just source code, or stale instructions will point users at removed commands.
