---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-3
type: convention
title: DELETE endpoints for domain resources (transactions, matching categories) return 204 No…
tags: [convention]
created: 2026-07-27
resource: src/app/api/transactions/[id]/route.ts.
---
DELETE endpoints for domain resources (transactions, matching categories) return 204 No Content on success.

## Learned
keep new resource-delete routes consistent with this response code rather than 200 with a body.

## Where
src/app/api/transactions/[id]/route.ts.
