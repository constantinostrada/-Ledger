---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-1
type: business-rule
title: Any userId supplied in a request body is ignored
tags: [business-rule]
created: 2026-07-23
resource: src/interfaces/auth/authenticateRequest.ts
---
Any userId supplied in a request body is ignored — the authenticated user's identity for all reads/writes comes only from the Bearer token via authenticateRequest.

## Why
prevents identity spoofing/smuggling through payloads.

## Where
src/interfaces/auth/authenticateRequest.ts
