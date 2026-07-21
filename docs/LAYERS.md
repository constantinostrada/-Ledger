# Clean Architecture Layers - Visual Guide

## Layer Dependency Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    INTERFACES LAYER                        ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ API Routes (Next.js App Router)                     │  ┃
┃  │  • /api/accounts/route.ts                           │  ┃
┃  │  • /api/transactions/route.ts                       │  ┃
┃  │  • /api/health/route.ts                             │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Controllers                                          │  ┃
┃  │  • AccountController.ts                             │  ┃
┃  │  • TransactionController.ts                         │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Validation (Zod Schemas)                            │  ┃
┃  │  • accountSchemas.ts                                │  ┃
┃  │  • transactionSchemas.ts                            │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Dependency Injection                                │  ┃
┃  │  • container.ts                                     │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
                    depends on (imports)
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   APPLICATION LAYER                        ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Use Cases (Business Workflows)                      │  ┃
┃  │  • CreateAccountUseCase.ts                          │  ┃
┃  │  • GetAccountsByUserUseCase.ts                      │  ┃
┃  │  • CreateTransactionUseCase.ts                      │  ┃
┃  │  • GetTransactionsUseCase.ts                        │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ DTOs (Data Transfer Objects)                        │  ┃
┃  │  • CreateAccountDTO.ts                              │  ┃
┃  │  • AccountDTO.ts                                    │  ┃
┃  │  • CreateTransactionDTO.ts                          │  ┃
┃  │  • TransactionDTO.ts                                │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Ports (Infrastructure Abstractions)                 │  ┃
┃  │  • IIdGenerator.ts                                  │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↓
                    depends on (imports)
                              ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                     DOMAIN LAYER                           ┃
┃                  (Core Business Logic)                     ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Entities (Business Objects)                         │  ┃
┃  │  • Account.ts                                       │  ┃
┃  │  • Transaction.ts                                   │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Value Objects (Immutable Values)                    │  ┃
┃  │  • Money.ts                                         │  ┃
┃  │  • TransactionType.ts                               │  ┃
┃  │  • AccountType.ts                                   │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Repository Interfaces (Contracts)                   │  ┃
┃  │  • IAccountRepository.ts                            │  ┃
┃  │  • ITransactionRepository.ts                        │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Domain Services (Multi-entity Logic)                │  ┃
┃  │  • TransactionService.ts                            │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                              ↑
                     implements (fulfills)
                              ↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                 INFRASTRUCTURE LAYER                       ┃
┃              (External I/O & Dependencies)                 ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Database Client                                     │  ┃
┃  │  • client.ts (PostgreSQL Pool)                      │  ┃
┃  │  • migrations/*.sql                                 │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Repository Implementations                          │  ┃
┃  │  • PostgresAccountRepository.ts                     │  ┃
┃  │  • PostgresTransactionRepository.ts                 │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ ID Generation                                       │  ┃
┃  │  • UuidGenerator.ts                                 │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ Configuration                                       │  ┃
┃  │  • DatabaseConfig.ts                                │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Request Flow Example

### Creating a Transaction

```
1. HTTP POST /api/transactions
   ↓
2. src/app/api/transactions/route.ts
   • Receives Next.js Request
   • Parses JSON body
   ↓
3. src/interfaces/validation/transactionSchemas.ts
   • Validates input with Zod
   • Throws if invalid
   ↓
4. src/interfaces/controllers/TransactionController.ts
   • Gets use case from DI container
   • Calls use case with validated data
   ↓
5. src/interfaces/di/container.ts
   • Provides CreateTransactionUseCase instance
   • With all dependencies wired
   ↓
6. src/application/use-cases/CreateTransactionUseCase.ts
   • Fetches Account from repository
   • Creates Transaction entity
   • Validates business rules via TransactionService
   • Saves Transaction via repository
   ↓
7. src/domain/entities/Transaction.ts
   • Validates transaction data
   • Enforces business rules in constructor
   ↓
8. src/domain/services/TransactionService.ts
   • Validates transaction can be applied to account
   • Calculates new balance
   ↓
9. src/infrastructure/repositories/PostgresTransactionRepository.ts
   • Converts domain entity to database row
   • Executes SQL INSERT
   ↓
10. PostgreSQL Database
    • Stores transaction record
    ↓
11. Use Case returns TransactionDTO
    ↓
12. Controller returns DTO to route handler
    ↓
13. Route handler sends JSON response
```

## Layer Responsibilities Summary

### 🔴 Interfaces Layer
**What it does:**
- Handles HTTP requests/responses
- Validates input
- Calls use cases
- Transforms DTOs to JSON

**What it doesn't do:**
- Business logic
- Database queries
- Direct domain manipulation

**Key principle:** Thin adapter layer

---

### 🟢 Application Layer
**What it does:**
- Orchestrates business workflows
- Coordinates domain objects
- Defines what the system does

**What it doesn't do:**
- Know about HTTP, databases, or frameworks
- Implement business rules (delegates to domain)

**Key principle:** Use cases are independent

---

### 🔵 Domain Layer
**What it does:**
- Contains all business rules
- Protects data invariants
- Defines business concepts

**What it doesn't do:**
- Know about the outside world
- Import external libraries
- Perform I/O operations

**Key principle:** Pure business logic

---

### 🟡 Infrastructure Layer
**What it does:**
- Implements domain/application interfaces
- Performs all I/O operations
- Interacts with external systems

**What it doesn't do:**
- Contain business logic
- Make business decisions

**Key principle:** Replaceable implementations

## Dependency Rules

### ✅ ALLOWED

```typescript
// Interfaces → Application
import { CreateAccountUseCase } from '@application/use-cases/CreateAccountUseCase';

// Application → Domain
import { Account } from '@domain/entities/Account';

// Infrastructure → Domain
import { IAccountRepository } from '@domain/repositories/IAccountRepository';

// Infrastructure → Application
import { CreateAccountDTO } from '@application/dtos/CreateAccountDTO';
```

### ❌ FORBIDDEN

```typescript
// Domain → Anything
import { Pool } from 'pg'; // ❌ NO!

// Application → Infrastructure
import { PostgresAccountRepository } from '@infrastructure/...'; // ❌ NO!

// Application → Interfaces
import { AccountController } from '@interfaces/...'; // ❌ NO!

// Interfaces → Domain
import { Account } from '@domain/entities/Account'; // ❌ NO! Use DTOs

// Interfaces → Infrastructure
import { PostgresAccountRepository } from '@infrastructure/...'; // ❌ NO!
```

## Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests │  ← Interfaces (API tests)
                    └─────────────┘
                  ┌───────────────────┐
                  │ Integration Tests │  ← Infrastructure (DB tests)
                  └───────────────────┘
              ┌─────────────────────────────┐
              │    Use Case Tests           │  ← Application (mocked repos)
              └─────────────────────────────┘
          ┌───────────────────────────────────────┐
          │         Unit Tests                    │  ← Domain (pure logic)
          └───────────────────────────────────────┘
```

### Domain Tests
- No mocks needed
- Fast execution
- Test business logic

### Application Tests
- Mock repositories
- Test orchestration
- Test use case logic

### Infrastructure Tests
- Real database (test DB)
- Test data mapping
- Test queries

### Interface Tests
- Full HTTP tests
- Test API contract
- Test error handling

## Key Benefits Visualization

```
┌──────────────────────────────────────────────────────────────┐
│                    CLEAN ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Testability                                              │
│     • Business logic tested without database                │
│     • Use cases tested with mocked dependencies             │
│                                                              │
│  ✅ Maintainability                                          │
│     • Clear boundaries between concerns                     │
│     • Easy to locate where changes belong                   │
│                                                              │
│  ✅ Flexibility                                              │
│     • Swap database without changing business logic         │
│     • Change web framework without touching core            │
│                                                              │
│  ✅ Independent Development                                  │
│     • Teams can work on different layers                    │
│     • Minimal merge conflicts                               │
│                                                              │
│  ✅ Business Logic Protection                                │
│     • Core business rules isolated from technical details   │
│     • Domain logic survives framework changes               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Common Questions

### Q: Where do I add new business logic?
**A:** In the **Domain Layer** (entities, value objects, or domain services)

### Q: Where do I add a new API endpoint?
**A:** 
1. Create route in `src/app/api/`
2. Add controller method in `src/interfaces/controllers/`
3. Wire to use case via DI container

### Q: Where do I change database queries?
**A:** In the **Infrastructure Layer** (repository implementations)

### Q: Where do I add input validation?
**A:** In the **Interfaces Layer** (Zod schemas in `src/interfaces/validation/`)

### Q: Where do I add business validation?
**A:** In the **Domain Layer** (entity constructors or domain services)

### Q: Can I call a use case from another use case?
**A:** No! Use cases should be independent. Extract shared logic to domain services.

### Q: Can I return a domain entity from an API?
**A:** No! Always return DTOs. Entities are internal to domain/application layers.

### Q: Where do environment variables go?
**A:** **Infrastructure Layer** only (`DatabaseConfig.ts`). Domain and Application layers should never access `process.env`.

---

**Remember:** Dependencies only point inward. Outer layers know about inner layers, but inner layers never know about outer layers.
