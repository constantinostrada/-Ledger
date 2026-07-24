---
id: 434519e1-a950-461f-8ce4-b42139a24517-5
type: convention
title: Manual/throwaway test users created while verifying auth flows use the @test.dev email…
tags: [convention]
created: 2026-07-24
resource: verification workflow for auth-related features
---
Manual/throwaway test users created while verifying auth flows use the @test.dev email domain

## Why
makes them identifiable so they can be bulk-deleted from the users table after verification instead of polluting the dev database

## Where
verification workflow for auth-related features
