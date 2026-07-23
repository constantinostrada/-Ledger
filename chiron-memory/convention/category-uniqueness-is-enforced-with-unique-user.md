---
id: 39de24a0-cc9c-4a08-b6dc-e338bc2184f6-1
type: convention
title: Category uniqueness is enforced with `@@unique([userId, name])`, mirroring the same…
tags: [convention]
created: 2026-07-23
resource: prisma/schema.prisma Category model.
---
Category uniqueness is enforced with `@@unique([userId, name])`, mirroring the same per-owner uniqueness pattern used elsewhere in the project (e.g. account/user uniqueness) rather than a global unique name.

## Where
prisma/schema.prisma Category model.
