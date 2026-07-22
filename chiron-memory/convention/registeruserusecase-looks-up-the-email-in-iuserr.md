---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-21
type: convention
title: RegisterUserUseCase looks up the email in IUserRepository first and returns a duplicate/409 error before hashing the password or saving
tags: [convention]
created: 2026-07-21
resource: src/application/use-cases/RegisterUserUseCase.ts, POST /api/auth/register route
---
RegisterUserUseCase looks up the email in IUserRepository first and returns a duplicate/409 error before hashing the password or saving

## Why
matches REST convention of 409 for resource-already-exists; avoids doing password-hashing work for a request that will be rejected.

## Where
src/application/use-cases/RegisterUserUseCase.ts, POST /api/auth/register route
