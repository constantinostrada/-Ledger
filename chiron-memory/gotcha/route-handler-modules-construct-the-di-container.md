---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-8
type: gotcha
title: Route handler modules construct the DI container (and its Prisma connection) at import…
tags: [gotcha]
created: 2026-07-23
resource: vitest.config.ts, tests/integration/setup-env.ts, src/interfaces/di/container.ts
---
Route handler modules construct the DI container (and its Prisma connection) at import time, so integration tests must load environment variables (setupFiles) before any route module is imported — otherwise the container initializes against a missing/wrong DATABASE_URL.

## Where
vitest.config.ts, tests/integration/setup-env.ts, src/interfaces/di/container.ts
