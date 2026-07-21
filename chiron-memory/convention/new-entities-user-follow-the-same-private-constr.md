---
type: convention
title: New entities (User) follow the same private-constructor + create()/reconstitute() factory pattern as existing domain entities, performing validation and normalization (lowercasing email, checking format/length) inside the factory rather than at the call site
tags: [convention]
created: 2026-07-21
resource: src/domain/entities/User.ts
---
New entities (User) follow the same private-constructor + create()/reconstitute() factory pattern as existing domain entities, performing validation and normalization (lowercasing email, checking format/length) inside the factory rather than at the…

## Why
keeps invariant enforcement centralized in the entity regardless of whether it's being freshly created or rehydrated from persistence.

## Where
src/domain/entities/User.ts
