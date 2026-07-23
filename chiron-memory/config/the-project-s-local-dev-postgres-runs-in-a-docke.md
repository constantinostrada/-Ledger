---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-11
type: config
title: The project's local dev Postgres runs in a docker-compose service named…
tags: [config]
created: 2026-07-23
resource: docker-compose.override.yml
---
The project's local dev Postgres runs in a docker-compose service named `ledger-postgres`, mapped to host port 5439 (not the default 5432).

## Where
docker-compose.override.yml
