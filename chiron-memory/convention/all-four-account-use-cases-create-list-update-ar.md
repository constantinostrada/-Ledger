---
id: 3df2f590-37db-4403-a807-c757fa71fd79-4
type: convention
title: All four account use cases (Create/List/Update/Archive) share one `accountMapper` for…
tags: [convention]
created: 2026-07-22
resource: src/application/mappers/accountMapper.ts.
---
All four account use cases (Create/List/Update/Archive) share one `accountMapper` for Account entity → AccountDTO conversion instead of duplicating mapping logic per use case.

## Where
src/application/mappers/accountMapper.ts.
