---
type: convention
title: Before declaring an auth/authorization feature complete, verification is done by starting the real dev server and running a curl-based e2e script that checks token issuance, spoofed-userId rejection, missing/garbage-token 401s, and cross-user data isolation, then deleting the seeded test users (email LIKE '%@test.dev') afterward
tags: [convention]
created: 2026-07-21
resource: scratchpad/auth-e2e.sh, cleanup via `DELETE FROM users WHERE email LIKE '%@test.dev'`
---
Before declaring an auth/authorization feature complete, verification is done by starting the real dev server and running a curl-based e2e script that checks token issuance, spoofed-userId rejection, missing/garbage-token 401s, and cross-user data i…

## Why
type-check/lint alone don't prove authorization boundaries actually hold at runtime; test data must not pollute the dev database afterward.

## Where
scratchpad/auth-e2e.sh, cleanup via `DELETE FROM users WHERE email LIKE '%@test.dev'`
