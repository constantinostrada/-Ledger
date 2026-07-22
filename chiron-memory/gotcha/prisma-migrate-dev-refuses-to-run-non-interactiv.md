---
id: 78622e61-4fce-40f0-af8d-d9c475184740-15
type: gotcha
title: `prisma migrate dev` refuses to run non-interactively when the new migration adds a…
tags: [gotcha]
created: 2026-07-22
---
`prisma migrate dev` refuses to run non-interactively when the new migration adds a unique constraint that Prisma flags as potentially conflicting with existing data, even when the new column is guaranteed all-NULL.

## Learned
Generate the SQL instead with `prisma migrate diff --from-url ... --to-schema-datamodel ...` written into the migration folder, then apply with `migrate deploy`.
