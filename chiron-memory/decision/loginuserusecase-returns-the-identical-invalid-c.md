---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-11
type: decision
title: LoginUserUseCase returns the identical "Invalid credentials" error whether the email…
tags: [decision]
created: 2026-07-21
resource: src/application/use-cases/LoginUserUseCase.ts
---
LoginUserUseCase returns the identical "Invalid credentials" error whether the email doesn't exist or the password is wrong

## Why
prevents leaking which emails are registered via differing error responses

## Learned
auth error messages must not distinguish between unknown-user and wrong-password cases.

## Where
src/application/use-cases/LoginUserUseCase.ts
