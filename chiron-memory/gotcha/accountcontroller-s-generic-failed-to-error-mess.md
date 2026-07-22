---
id: 3df2f590-37db-4403-a807-c757fa71fd79-5
type: gotcha
title: AccountController's generic 'Failed to …:' error-message wrapping was swallowing domain…
tags: [gotcha]
created: 2026-07-22
resource: src/interfaces/controllers/AccountController.ts.
---
AccountController's generic 'Failed to …:' error-message wrapping was swallowing domain error messages like 'Account not found', preventing the HTTP layer from mapping them to 404.

## Why
uniform error contract relies on matching specific domain error text to status codes; wrapping breaks that match.

## Learned
don't wrap/prefix use-case error messages in controllers — let them propagate as-is for status mapping.

## Where
src/interfaces/controllers/AccountController.ts.
