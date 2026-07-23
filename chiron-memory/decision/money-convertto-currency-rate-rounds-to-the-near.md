---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-15
type: decision
title: Money.convertTo(currency, rate) rounds to the nearest cent and guards against…
tags: [decision]
created: 2026-07-23
resource: src/domain/value-objects/Money.ts
---
Money.convertTo(currency, rate) rounds to the nearest cent and guards against non-positive rates

## Why
keeps currency conversion centralized in the value object with consistent rounding/validation rather than scattered in use cases

## Where
src/domain/value-objects/Money.ts
