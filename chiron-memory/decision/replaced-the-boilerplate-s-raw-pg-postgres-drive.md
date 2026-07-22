---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-0
type: decision
title: Replaced the boilerplate's raw `pg` Postgres driver stack (connection pool, hand-written…
tags: [decision]
created: 2026-07-21
resource: prisma/schema.prisma, src/infrastructure/database/prisma.ts, src/infrastructure/repositories/Prisma{Account,Transaction,Category}Repository.ts.
---
Replaced the boilerplate's raw `pg` Postgres driver stack (connection pool, hand-written SQL migration files, Postgres*Repository classes, scripts/migrate.ts) with Prisma (schema.prisma + prisma migrate + PrismaClient singleton + Prisma*Repository classes).

## Why
B1 acceptance criteria explicitly required a Prisma schema, migration, and `npm run prisma:seed`; pg and @types/pg were uninstalled.

## Where
prisma/schema.prisma, src/infrastructure/database/prisma.ts, src/infrastructure/repositories/Prisma{Account,Transaction,Category}Repository.ts.
