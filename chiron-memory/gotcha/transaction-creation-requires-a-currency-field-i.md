---
id: 3df2f590-37db-4403-a807-c757fa71fd79-7
type: gotcha
title: Transaction creation requires a `currency` field in the request body; omitting it fails Zod validation with 'Required' rather than any balance-calculation bug.
tags: [gotcha]
created: 2026-07-22
---
Transaction creation requires a `currency` field in the request body; omitting it fails Zod validation with 'Required' rather than any balance-calculation bug.

## Learned
when an e2e balance check fails, first check whether the transaction POSTs actually succeeded (e.g. missing required fields) before suspecting the derivation logic.
