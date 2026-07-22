---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-4
type: gotcha
title: This dev machine already runs a native Postgres on localhost:5432, and other local Docker projects occupy 5433/5434, so the ledger project's dockerized `ledger-postgres` container must be remapped to a free host port.
tags: [gotcha]
created: 2026-07-21
resource: a gitignored docker-compose.override.yml maps the container to host port 5439, with .env's DATABASE_URL pointing at 5439; committed docker-compose.yml and .env.example keep the default 5432.
---
This dev machine already runs a native Postgres on localhost:5432, and other local Docker projects occupy 5433/5434, so the ledger project's dockerized `ledger-postgres` container must be remapped to a free host port.

## Why
`docker compose up` on 5432/5433 failed (P1010 access denied / port-binding error) because those ports were already owned by unrelated Postgres instances.

## Learned
when Prisma/Postgres connections fail locally, check `lsof -nP -iTCP -sTCP:LISTEN` for port conflicts before assuming a config or auth bug.

## Where
a gitignored docker-compose.override.yml maps the container to host port 5439, with .env's DATABASE_URL pointing at 5439; committed docker-compose.yml and .env.example keep the default 5432.
