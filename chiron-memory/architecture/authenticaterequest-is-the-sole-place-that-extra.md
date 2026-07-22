---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-19
type: architecture
title: authenticateRequest() is the sole place that extracts/verifies the Bearer JWT and…
tags: [architecture]
created: 2026-07-21
resource: src/interfaces/auth/authenticateRequest.ts
---
authenticateRequest() is the sole place that extracts/verifies the Bearer JWT and resolves request identity; accounts/transactions routes 401 without a valid token and derive all scoping from it

## Why
centralizes identity extraction so no route/controller can accidentally trust a client-supplied user id.

## Where
src/interfaces/auth/authenticateRequest.ts
