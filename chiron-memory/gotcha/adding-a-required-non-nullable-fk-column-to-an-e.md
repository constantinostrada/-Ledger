---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-20
type: gotcha
title: Adding a required (non-nullable) FK column to an existing populated table (Account.userId) forced truncating the accounts/transactions tables before running `prisma migrate dev --name add_users`
tags: [gotcha]
created: 2026-07-21
resource: prisma/schema.prisma, executed via `psql ... TRUNCATE transactions, accounts` immediately before `npx prisma migrate dev`
---
Adding a required (non-nullable) FK column to an existing populated table (Account.userId) forced truncating the accounts/transactions tables before running `prisma migrate dev --name add_users`

## Why
existing account rows had no user to reference, so the new required FK would violate the constraint on migration

## Learned
when a migration adds a required FK to a table with existing data, either backfill/assign a default first or clear the table — Prisma migrate dev will not silently handle orphaned rows.

## Where
prisma/schema.prisma, executed via `psql ... TRUNCATE transactions, accounts` immediately before `npx prisma migrate dev`
