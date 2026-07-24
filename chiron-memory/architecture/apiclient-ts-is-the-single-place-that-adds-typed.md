---
id: 35a2fb67-9056-4df0-8bd8-cb93a461ca6c-2
type: architecture
title: apiClient.ts is the single place that adds typed frontend methods per backend endpoint…
tags: [architecture]
created: 2026-07-24
resource: src/interfaces/web/apiClient.ts
---
apiClient.ts is the single place that adds typed frontend methods per backend endpoint (e.g. createAccount → POST /api/accounts, getNetWorthReport → GET /api/reports/net-worth), importing only application-layer DTOs

## Why
keeps the web interface layer decoupled from domain/infrastructure types, consistent with the clean-architecture layering

## Learned
new frontend API calls should be added here as typed methods, not as ad-hoc fetch calls in page components.

## Where
src/interfaces/web/apiClient.ts
