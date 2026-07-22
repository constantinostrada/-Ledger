---
id: 78622e61-4fce-40f0-af8d-d9c475184740-11
type: business-rule
title: Exceeding a budget is only flagged, never blocked
tags: [business-rule]
created: 2026-07-22
resource: Budget.remaining/percentUsed/isOverBudget, verified against live server with a $1,000 rent budget and $1,200 of rent expenses.
---
Exceeding a budget is only flagged, never blocked — transactions can push spent past the limit, and the API reports remainingCents as negative and percentUsed above 100 with overBudget:true instead of rejecting the transaction or clamping the values.

## Where
Budget.remaining/percentUsed/isOverBudget, verified against live server with a $1,000 rent budget and $1,200 of rent expenses.
