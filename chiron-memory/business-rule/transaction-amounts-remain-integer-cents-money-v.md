---
id: 3df2f590-37db-4403-a807-c757fa71fd79-14
type: business-rule
title: Transaction amounts remain integer cents (`Money` value object)
tags: [business-rule]
created: 2026-07-22
---
Transaction amounts remain integer cents (`Money` value object) — floats are rejected at both the zod HTTP-edge layer and the domain layer. Account balance is a derived aggregate that updates immediately on transaction posting; posting an expense that would make the balance negative is rejected with "Insufficient funds for expense transaction".

## Learned
Verified end-to-end: 30,000 opening + 100,000 income − 25,000 expense = 105,000 cents; `amountCents: 100.5` → 400.
