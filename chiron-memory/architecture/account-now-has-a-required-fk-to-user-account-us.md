---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-18
type: architecture
title: Account now has a required FK to User (Account.userId) with cascade delete, migrated via `add_users` Prisma migration
tags: [architecture]
created: 2026-07-21
resource: prisma/schema.prisma
---
Account now has a required FK to User (Account.userId) with cascade delete, migrated via `add_users` Prisma migration

## Why
introducing per-user auth scoping (B2) required accounts to belong to a real user row, replacing the prior userId-less/ungated account model.

## Where
prisma/schema.prisma
