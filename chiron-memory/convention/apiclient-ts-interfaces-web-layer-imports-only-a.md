---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-6
type: convention
title: `apiClient.ts` (interfaces/web layer) imports only application-layer DTOs (type-only…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/apiClient.ts
---
`apiClient.ts` (interfaces/web layer) imports only application-layer DTOs (type-only imports), never domain-layer types, keeping the web client on the correct side of the layering boundary

## Where
src/interfaces/web/apiClient.ts
