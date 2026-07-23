---
id: 9dbbdd20-4b9e-4971-baa1-afadce880ee5-6
type: architecture
title: Account balances are always derived from transaction history rather than stored as a…
tags: [architecture]
created: 2026-07-23
---
Account balances are always derived from transaction history rather than stored as a running total; creating an account with a non-zero opening balance materializes it as a regular integer-cents transaction instead of setting a balance field directly.
