---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-3
type: business-rule
title: Deleting a category is blocked with 409 if it is referenced by any transaction, recurring…
tags: [business-rule]
created: 2026-07-23
resource: src/application/use-cases/DeleteCategoryUseCase.ts, ICategoryRepository.isInUse().
---
Deleting a category is blocked with 409 if it is referenced by any transaction, recurring rule, or budget; there is no auto-reassignment.

## Where
src/application/use-cases/DeleteCategoryUseCase.ts, ICategoryRepository.isInUse().
