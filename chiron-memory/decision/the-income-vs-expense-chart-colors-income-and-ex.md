---
id: 11534d18-840b-4b92-ab1b-9192ecb0a99d-0
type: decision
title: The income-vs-expense chart colors income and expense series with a blue/red pair instead…
tags: [decision]
created: 2026-07-27
resource: src/app/(authenticated)/reports/page.tsx, globals.css
---
The income-vs-expense chart colors income and expense series with a blue/red pair instead of the intuitive green/red

## Why
green/red fails deuteranopia colorblind checks under the dataviz skill's palette validator, while the blue/red pair passes CVD separation

## Learned
run the dataviz skill's validate_palette script on any new categorical chart palette before committing to it.

## Where
src/app/(authenticated)/reports/page.tsx, globals.css
