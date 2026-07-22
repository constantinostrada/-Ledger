---
id: 78622e61-4fce-40f0-af8d-d9c475184740-7
type: business-rule
title: A Budget's limitCents must be positive
tags: [business-rule]
created: 2026-07-22
resource: src/domain/entities/Budget.ts.
---
A Budget's limitCents must be positive — the Budget entity enforces a positive-limit invariant in its constructor/create() factory.

## Where
src/domain/entities/Budget.ts.
