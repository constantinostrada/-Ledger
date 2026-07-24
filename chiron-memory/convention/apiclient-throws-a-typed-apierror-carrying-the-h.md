---
id: 434519e1-a950-461f-8ce4-b42139a24517-4
type: convention
title: ApiClient throws a typed ApiError carrying the HTTP status code and the server's {error}…
tags: [convention]
created: 2026-07-24
resource: src/interfaces/web/apiClient.ts
---
ApiClient throws a typed ApiError carrying the HTTP status code and the server's {error} message body on any non-2xx response

## Why
lets calling UI code distinguish specific failure cases (e.g. 409 duplicate email on register vs 401 invalid credentials on login) instead of a generic failure

## Where
src/interfaces/web/apiClient.ts
