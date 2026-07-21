---
type: convention
title: BcryptPasswordHasher uses 10 salt rounds; JwtTokenService issues tokens with 1-day expiry
tags: [convention]
created: 2026-07-21
resource: src/infrastructure/security/BcryptPasswordHasher.ts, JwtTokenService.ts
---
BcryptPasswordHasher uses 10 salt rounds; JwtTokenService issues tokens with 1-day expiry

## Why
baseline security defaults chosen for this project's auth (B2 milestone).

## Where
src/infrastructure/security/BcryptPasswordHasher.ts, JwtTokenService.ts
