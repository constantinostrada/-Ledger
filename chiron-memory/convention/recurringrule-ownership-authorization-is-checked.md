---
id: 78622e61-4fce-40f0-af8d-d9c475184740-18
type: convention
title: RecurringRule ownership/authorization is checked via its account relation (account_id →…
tags: [convention]
created: 2026-07-22
resource: src/infrastructure/repositories/PrismaRecurringRuleRepository.ts, src/application/use-cases/CreateRecurringRuleUseCase.ts.
---
RecurringRule ownership/authorization is checked via its account relation (account_id → account.user), the same not-found-error pattern used for transactions, rather than storing a direct user/tenant id on the rule.

## Where
src/infrastructure/repositories/PrismaRecurringRuleRepository.ts, src/application/use-cases/CreateRecurringRuleUseCase.ts.
