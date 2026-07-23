---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-4
type: architecture
title: Every new user gets a default set of 9 starter categories (defaultCategorySeeds() in…
tags: [architecture]
created: 2026-07-23
resource: src/domain/services/defaultCategories.ts, src/application/use-cases/RegisterUserUseCase.ts.
---
Every new user gets a default set of 9 starter categories (defaultCategorySeeds() in src/domain/services/defaultCategories.ts) seeded during RegisterUserUseCase via ICategoryRepository.saveAll.

## Where
src/domain/services/defaultCategories.ts, src/application/use-cases/RegisterUserUseCase.ts.
