---
id: 11534d18-840b-4b92-ab1b-9192ecb0a99d-5
type: gotcha
title: The report chart's hover tooltip is positioned via percentages relative to its wrapper…
tags: [gotcha]
created: 2026-07-27
resource: src/app/(authenticated)/reports/page.tsx.
---
The report chart's hover tooltip is positioned via percentages relative to its wrapper element, so any max-width constraint must be applied to the wrapper div, not to inner SVG/child elements

## Why
applying the width cap on an inner element broke tooltip placement since percentages resolved against the wrong box

## Where
src/app/(authenticated)/reports/page.tsx.
