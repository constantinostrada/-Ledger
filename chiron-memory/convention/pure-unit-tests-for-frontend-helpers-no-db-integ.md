---
id: 35a2fb67-9056-4df0-8bd8-cb93a461ca6c-3
type: convention
title: Pure/unit tests for frontend helpers (no DB/integration setup) live at the top level of…
tags: [convention]
created: 2026-07-24
resource: tests/format-money.test.ts vs tests/integration/
---
Pure/unit tests for frontend helpers (no DB/integration setup) live at the top level of tests/ (e.g. tests/format-money.test.ts), separate from tests/integration which requires the shared dev Postgres and global-setup

## Learned
don't route simple pure-function unit tests through the integration global-setup.

## Where
tests/format-money.test.ts vs tests/integration/
