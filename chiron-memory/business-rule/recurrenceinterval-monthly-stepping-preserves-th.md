---
id: 78622e61-4fce-40f0-af8d-d9c475184740-14
type: business-rule
title: RecurrenceInterval MONTHLY stepping preserves the original start day-of-month and clamps…
tags: [business-rule]
created: 2026-07-22
resource: src/domain/value-objects/RecurrenceInterval.ts.
---
RecurrenceInterval MONTHLY stepping preserves the original start day-of-month and clamps to the last valid day of shorter months (e.g. Jan 31 → Feb 28 → Mar 31) instead of adding a fixed number of days.

## Where
src/domain/value-objects/RecurrenceInterval.ts.
