---
id: 3df2f590-37db-4403-a807-c757fa71fd79-9
type: convention
title: Domain `Account` entity exposes state transitions only through dedicated mutator methods — `rename()`, `changeType()`, `archive()` — rather than public setters, so each mutation can protect its own invariants at the entity boundary.
tags: [convention]
created: 2026-07-22
resource: src/domain/entities/Account.ts, used by UpdateAccountUseCase and ArchiveAccountUseCase.
---
Domain `Account` entity exposes state transitions only through dedicated mutator methods — `rename()`, `changeType()`, `archive()` — rather than public setters, so each mutation can protect its own invariants at the entity boundary.

## Where
src/domain/entities/Account.ts, used by UpdateAccountUseCase and ArchiveAccountUseCase.
