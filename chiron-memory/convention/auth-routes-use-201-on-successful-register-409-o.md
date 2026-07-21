---
type: convention
title: Auth routes use 201 on successful register, 409 on duplicate email, 200 on successful login, 401 on any login failure (unknown email or wrong password alike)
tags: [convention]
created: 2026-07-21
resource: src/app/api/auth/register/route.ts, src/app/api/auth/login/route.ts
---
Auth routes use 201 on successful register, 409 on duplicate email, 200 on successful login, 401 on any login failure (unknown email or wrong password alike)

## Why
consistent with the uniform error-contract status mapping and with LoginUserUseCase's identical-error-message rule for unknown-user vs wrong-password.

## Where
src/app/api/auth/register/route.ts, src/app/api/auth/login/route.ts
