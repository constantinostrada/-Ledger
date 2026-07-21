---
type: architecture
title: Category is a new domain entity added in B1 (not in the original boilerplate), with its own ICategoryRepository port and PrismaCategoryRepository implementation alongside the pre-existing Account/Transaction ports; Transaction now carries an optional categoryId with an FK that is SetNull on category delete.
tags: [architecture]
created: 2026-07-21
resource: src/domain/entities/Category.ts, src/domain/repositories/ICategoryRepository.ts, src/infrastructure/repositories/PrismaCategoryRepository.ts, prisma/schema.prisma.
---
Category is a new domain entity added in B1 (not in the original boilerplate), with its own ICategoryRepository port and PrismaCategoryRepository implementation alongside the pre-existing Account/Transaction ports; Transaction now carries an optiona…

## Where
src/domain/entities/Category.ts, src/domain/repositories/ICategoryRepository.ts, src/infrastructure/repositories/PrismaCategoryRepository.ts, prisma/schema.prisma.
