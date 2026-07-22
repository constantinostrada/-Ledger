---
id: 3df2f590-37db-4403-a807-c757fa71fd79-8
type: gotcha
title: Next.js dev server auto-increments the port when the default (3000) is busy, silently…
tags: [gotcha]
created: 2026-07-22
resource: `npm run dev` output, ledger project e2e verification scripts.
---
Next.js dev server auto-increments the port when the default (3000) is busy, silently trying 3001, 3002, ... up to 3006 in this session before binding.

## Learned
e2e scripts/tools must detect the actual bound port from the dev server's own startup output rather than hardcoding localhost:3000, or requests will hit the wrong (or no) server.

## Where
`npm run dev` output, ledger project e2e verification scripts.
