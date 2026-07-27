---
id: 543d6e2c-e0e3-4366-87d9-47280f239b46
type: architecture
title: Account archiving model
tags: [architecture]
created: 2026-07-27
resource: src/interfaces/web/apiClient.ts, src/app/api/accounts/[id]/route.ts, IAccountRepository.ts, ArchiveAccountUseCase.ts, src/app/api/accounts/route.ts, src/app/(authenticated)/transactions/page.tsx, src/application/use-cases/GetNetWorthReportUseCase.ts
---
Account archiving model: soft-delete with selective visibility

## Why
Preserves transaction history and data integrity while preventing new activity on closed accounts

## Learned
Archive via DELETE /api/accounts/:id (apiClient.archiveAccount) sets isActive=false, never deletes rows · Default account list excludes archived (IAccountRepository.findByUserId includeArchived=false, GET /api/accounts?includeArchived=true overrides) · Archived accounts appear in transaction row displays and filter dropdowns (historic legibility) but are hidden from add/edit form account picker unless the transaction already belongs to that archived account · Net worth report includes archived accounts in totals because they still hold funds

## Where
src/interfaces/web/apiClient.ts, src/app/api/accounts/[id]/route.ts, IAccountRepository.ts, ArchiveAccountUseCase.ts, src/app/api/accounts/route.ts, src/app/(authenticated)/transactions/page.tsx, src/application/use-cases/GetNetWorthReportUseCase.ts
