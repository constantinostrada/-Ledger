---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-6
type: convention
title: Category create/rename duplicate-name checks mirror the existing register-email…
tags: [convention]
created: 2026-07-23
resource: src/application/use-cases/CreateCategoryUseCase.ts, UpdateCategoryUseCase.ts.
---
Category create/rename duplicate-name checks mirror the existing register-email uniqueness pattern (check-then-guard in the use case, not just relying on the DB constraint), and self-rename (same name, same category) is explicitly allowed rather than treated as a duplicate.

## Where
src/application/use-cases/CreateCategoryUseCase.ts, UpdateCategoryUseCase.ts.
