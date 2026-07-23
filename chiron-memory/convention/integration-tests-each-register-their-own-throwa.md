---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-10
type: convention
title: Integration tests each register their own throwaway user with email pattern…
tags: [convention]
created: 2026-07-23
resource: tests/integration/helpers.ts, tests/integration/global-setup.ts
---
Integration tests each register their own throwaway user with email pattern `it-<uuid>@ledger.test`, and a vitest globalSetup teardown deletes all such users after the run (relations cascade), keeping suites isolated from each other, from seed data, and leaving the shared dev Postgres clean.

## Where
tests/integration/helpers.ts, tests/integration/global-setup.ts
