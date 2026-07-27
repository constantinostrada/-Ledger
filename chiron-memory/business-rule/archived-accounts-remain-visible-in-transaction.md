---
id: eb798f90-a912-4d18-b5b0-440d9fe8068a-5
type: business-rule
title: Archived accounts remain visible in transaction row lookups and filter dropdowns (so…
tags: [business-rule]
created: 2026-07-27
resource: src/app/(authenticated)/transactions/page.tsx.
---
Archived accounts remain visible in transaction row lookups and filter dropdowns (so historical transactions still display correctly) but are excluded from the account picker in the add/edit form, unless the transaction currently being edited already belongs to that archived account.

## Why
preserves legibility of historic data while preventing new transactions from being posted to archived accounts.

## Where
src/app/(authenticated)/transactions/page.tsx.
