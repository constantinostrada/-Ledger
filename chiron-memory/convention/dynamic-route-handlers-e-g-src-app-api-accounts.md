---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-9
type: convention
title: Dynamic-route handlers (e.g. src/app/api/accounts/[id]/route.ts) type their second…
tags: [convention]
created: 2026-07-23
---
Dynamic-route handlers (e.g. src/app/api/accounts/[id]/route.ts) type their second argument as a required `{ params: { id: string } }` context, not optional — test helpers invoking these handlers directly must always supply that params object or type-check fails.
