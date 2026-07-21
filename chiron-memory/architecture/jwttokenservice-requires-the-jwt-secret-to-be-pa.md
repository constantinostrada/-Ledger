---
type: architecture
title: JwtTokenService requires the JWT secret to be passed at construction time (fails fast if missing) rather than reading it lazily per-call
tags: [architecture]
created: 2026-07-21
resource: src/infrastructure/security/JwtTokenService.ts, wired in src/interfaces/di/container.ts, JWT_SECRET in .env/.env.example
---
JwtTokenService requires the JWT secret to be passed at construction time (fails fast if missing) rather than reading it lazily per-call

## Why
surfaces missing JWT_SECRET config immediately at container/DI wiring time instead of at first request

## Learned
prefer constructor-time validation of required secrets over per-call checks.

## Where
src/infrastructure/security/JwtTokenService.ts, wired in src/interfaces/di/container.ts, JWT_SECRET in .env/.env.example
