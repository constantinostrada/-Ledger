---
id: 434519e1-a950-461f-8ce4-b42139a24517-0
type: architecture
title: The typed API client (ApiClient) and AuthContext/useAuth live in src/interfaces/web/, not…
tags: [architecture]
created: 2026-07-24
resource: src/interfaces/web/apiClient.ts, src/interfaces/web/AuthContext.tsx
---
The typed API client (ApiClient) and AuthContext/useAuth live in src/interfaces/web/, not under src/app

## Why
keeps the client-side adapter in the interfaces layer so it only imports application-layer DTO types (AuthResultDTO, RegisterUserDTO, LoginUserDTO, AccountDTO), respecting the clean-architecture dependency rule

## Where
src/interfaces/web/apiClient.ts, src/interfaces/web/AuthContext.tsx
