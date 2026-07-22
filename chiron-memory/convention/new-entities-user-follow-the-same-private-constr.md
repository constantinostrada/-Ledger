---
id: 4542cef1-7a8d-4ad0-a75b-ef4d2b9b5d5c-23
type: convention
title: New entities (User) follow the same private-constructor + create()/reconstitute() factory…
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/User.ts
---
New entities (User) follow the same private-constructor + create()/reconstitute() factory pattern as existing domain entities, performing validation and normalization (lowercasing email, checking format/length) inside the factory rather than at the call site

## Why
keeps invariant enforcement centralized in the entity regardless of whether it's being freshly created or rehydrated from persistence.

## Where
src/domain/entities/User.ts
