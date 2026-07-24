---
id: 434519e1-a950-461f-8ce4-b42139a24517-1
type: convention
title: AuthProvider exposes a status field with three values…
tags: [convention]
created: 2026-07-24
resource: src/interfaces/web/AuthContext.tsx
---
AuthProvider exposes a status field with three values (loading/authenticated/unauthenticated) and persists the session in localStorage, hydrating it on mount

## Why
the loading state exists specifically so auth guards don't redirect to /login before the stored session has had a chance to hydrate on page load

## Where
src/interfaces/web/AuthContext.tsx
