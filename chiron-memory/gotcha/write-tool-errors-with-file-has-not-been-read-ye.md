---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-14
type: gotcha
title: Write tool errors with "File has not been read yet" when overwriting an existing file…
tags: [gotcha]
created: 2026-07-21
resource: encountered on AccountController.ts and TransactionController.ts during B2 rewrite
---
Write tool errors with "File has not been read yet" when overwriting an existing file that hasn't been Read in the current context

## Why
safety guard against blind overwrites

## Learned
Read (even a small `limit`) an existing file immediately before Write-overwriting it, even if you authored its prior version in the same session but it wasn't the last thing read.

## Where
encountered on AccountController.ts and TransactionController.ts during B2 rewrite
