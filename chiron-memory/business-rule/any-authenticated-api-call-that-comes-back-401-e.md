---
id: 434519e1-a950-461f-8ce4-b42139a24517-3
type: business-rule
title: Any authenticated API call that comes back 401 (e.g. a stale/expired stored JWT) clears…
tags: [business-rule]
created: 2026-07-24
resource: src/interfaces/web/AuthContext.tsx / apiClient.ts
---
Any authenticated API call that comes back 401 (e.g. a stale/expired stored JWT) clears the client-side session and redirects the user to /login

## Why
prevents the app getting stuck in a state where a bad token is retried indefinitely

## Where
src/interfaces/web/AuthContext.tsx / apiClient.ts
