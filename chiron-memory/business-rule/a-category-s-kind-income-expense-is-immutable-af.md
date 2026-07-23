---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-2
type: business-rule
title: A Category's `kind` (INCOME/EXPENSE) is immutable after creation
tags: [business-rule]
created: 2026-07-23
resource: src/domain/entities/Category.ts.
---
A Category's `kind` (INCOME/EXPENSE) is immutable after creation — only `name` (via rename()) and `color` (via changeColor()) can be mutated.

## Why
flipping kind on an existing category would silently change the meaning of budgets/transactions already attached to it.

## Where
src/domain/entities/Category.ts.
