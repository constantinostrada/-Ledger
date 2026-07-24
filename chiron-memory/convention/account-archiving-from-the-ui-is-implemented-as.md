---
id: 35a2fb67-9056-4df0-8bd8-cb93a461ca6c-1
type: convention
title: Account archiving from the UI is implemented as a soft delete via DELETE…
tags: [convention]
created: 2026-07-24
resource: src/interfaces/web/apiClient.ts, src/app/api/accounts/[id]/route.ts
---
Account archiving from the UI is implemented as a soft delete via DELETE /api/accounts/:id, exposed through apiClient.archiveAccount()

## Learned
future account-management UI work should reuse archiveAccount() rather than adding a new endpoint/method for deactivation.

## Where
src/interfaces/web/apiClient.ts, src/app/api/accounts/[id]/route.ts
