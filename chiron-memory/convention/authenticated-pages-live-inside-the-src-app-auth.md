---
id: 434519e1-a950-461f-8ce4-b42139a24517-2
type: convention
title: Authenticated pages live inside the src/app/(authenticated)/ route group, whose layout…
tags: [convention]
created: 2026-07-24
resource: src/app/(authenticated)/layout.tsx, src/app/(authenticated)/dashboard/page.tsx
---
Authenticated pages live inside the src/app/(authenticated)/ route group, whose layout performs the auth guard (redirect to /login if unauthenticated) and renders the shared app shell (header, user name, logout) around children

## Where
src/app/(authenticated)/layout.tsx, src/app/(authenticated)/dashboard/page.tsx
