---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-10
type: gotcha
title: src/app/api/health/route.ts imported the infrastructure `DatabaseClient` (pg pool) directly instead of going through the DI container/repository ports, bypassing clean-architecture layering; this only surfaced as a stale-import error from `npm run type-check` after the pg→Prisma swap, not from reviewing the DI container or repositories.
tags: [gotcha]
created: 2026-07-21
---
src/app/api/health/route.ts imported the infrastructure `DatabaseClient` (pg pool) directly instead of going through the DI container/repository ports, bypassing clean-architecture layering; this only surfaced as a stale-import error from `npm run t…

## Why
route handlers can reach into infrastructure directly since Next.js doesn't enforce layer boundaries.

## Learned
when swapping persistence tech, run type-check and grep app/api routes for direct infrastructure imports — don't assume the DI container is the only place old classes are referenced.
