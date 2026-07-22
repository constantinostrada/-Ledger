---
id: 3df2f590-37db-4403-a807-c757fa71fd79-2
type: convention
title: Archived accounts are hidden from the default account list
tags: [convention]
created: 2026-07-22
resource: IAccountRepository.ts, ArchiveAccountUseCase.ts, src/app/api/accounts/route.ts.
---
Archived accounts are hidden from the default account list; IAccountRepository.findByUserId takes an `includeArchived` option (default false), exposed via `GET /api/accounts?includeArchived=true`. Archive is a soft delete (isActive flag) that preserves transaction history, not a row deletion.

## Where
IAccountRepository.ts, ArchiveAccountUseCase.ts, src/app/api/accounts/route.ts.
