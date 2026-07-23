---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-12
type: contradiction
title: The pre-existing docs/API.md was stale boilerplate that predated the current auth/money…
tags: [contradiction]
created: 2026-07-23
---
The pre-existing docs/API.md was stale boilerplate that predated the current auth/money model — it documented no authentication, float-typed amounts, and userId passed in request bodies, none of which match current behavior (Bearer auth, integer cents, token-only identity).

## Learned
it was fully rewritten to cover all 21 endpoints; don't trust older cached copies or summaries of this file.
