---
id: 78622e61-4fce-40f0-af8d-d9c475184740-16
type: config
title: The ledger project had no test framework before this work
tags: [config]
created: 2026-07-22
resource: ledger/vitest.config.ts, ledger/package.json, ledger/tests/.
---
The ledger project had no test framework before this work; vitest was added as the test runner (`npm test` → `vitest run`) with vitest.config.ts sharing the same path aliases as tsconfig.json.

## Where
ledger/vitest.config.ts, ledger/package.json, ledger/tests/.
