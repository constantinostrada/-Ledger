---
id: 28d83c3a-85df-4235-906c-82cf7bc8f4d4-9
type: convention
title: Authenticated pages handle a 401 from the API by automatically logging the user out (via…
tags: [convention]
created: 2026-07-27
resource: src/interfaces/web/AuthContext.tsx
---
Authenticated pages handle a 401 from the API by automatically logging the user out (via AuthContext) rather than showing an inline error, applied consistently across pages (e.g. transactions, budgets)

## Where
src/interfaces/web/AuthContext.tsx
