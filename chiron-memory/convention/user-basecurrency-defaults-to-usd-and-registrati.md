---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-16
type: convention
title: User.baseCurrency defaults to USD and registration accepts an optional baseCurrency field
tags: [convention]
created: 2026-07-23
resource: src/domain/entities/User.ts, src/application/dtos/RegisterUserDTO.ts, src/application/use-cases/RegisterUserUseCase.ts
---
User.baseCurrency defaults to USD and registration accepts an optional baseCurrency field

## Why
keeps existing single-currency users working unchanged while letting new users opt into a non-USD base currency at signup

## Where
src/domain/entities/User.ts, src/application/dtos/RegisterUserDTO.ts, src/application/use-cases/RegisterUserUseCase.ts
