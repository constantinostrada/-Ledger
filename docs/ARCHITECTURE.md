# Architecture Documentation

## Overview

Ledger follows **Clean Architecture** (also known as Hexagonal Architecture or Ports and Adapters) as defined by Robert C. Martin. This architectural pattern ensures:

- **Independence from frameworks**: Business logic is not tied to Next.js or any other framework
- **Testability**: Business logic can be tested without UI, database, or external services
- **Independence from UI**: UI can be changed without affecting business logic
- **Independence from database**: Database can be swapped without changing business rules
- **Independence from external agencies**: Business rules don't know about the outside world

## Layer Breakdown

### 1. Domain Layer (`src/domain/`)

**Purpose**: Contains all business logic and rules. This is the heart of the application.

**Characteristics**:
- Zero external dependencies (only native TypeScript)
- No knowledge of databases, HTTP, or infrastructure
- Pure business logic and domain models

**Components**:

#### Entities (`entities/`)
Business objects with unique identity and lifecycle.

Example: `Account`, `Transaction`

```typescript
export class Account {
  private readonly props: AccountProps;
  
  constructor(props: AccountProps) {
    this.validateAccount(props); // Business rules enforced here
    this.props = props;
  }
  
  canDebit(amount: Money): boolean {
    // Business logic
  }
}
```

#### Value Objects (`value-objects/`)
Immutable objects defined by their values, not identity.

Example: `Money`, `TransactionType`

```typescript
export class Money {
  private readonly amount: number;
  private readonly currency: string;
  
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }
}
```

#### Repository Interfaces (`repositories/`)
Contracts for data persistence (implementations in infrastructure).

```typescript
export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
```

#### Domain Services (`services/`)
Business logic that doesn't belong to a single entity.

```typescript
export class TransactionService {
  applyTransactionToAccount(account: Account, transaction: Transaction): Money {
    // Multi-entity business logic
  }
}
```

### 2. Application Layer (`src/application/`)

**Purpose**: Orchestrates domain objects to fulfill use cases. Contains application-specific business rules.

**Characteristics**:
- Depends only on domain layer
- Defines interfaces for external dependencies (ports)
- Coordinates domain objects to achieve goals

**Components**:

#### Use Cases (`use-cases/`)
Each use case represents one business workflow. One class per use case.

```typescript
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly transactionService: TransactionService
  ) {}
  
  async execute(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    // 1. Fetch required data
    // 2. Apply business logic via domain objects
    // 3. Persist changes
    // 4. Return DTO
  }
}
```

**Use Case Rules**:
- One public method: `execute(dto)`
- Receives dependencies via constructor injection
- Returns DTOs, never domain entities
- Independent of other use cases

#### DTOs (`dtos/`)
Data Transfer Objects for input/output across layer boundaries.

```typescript
export interface CreateTransactionDTO {
  accountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  // ... primitive types only
}
```

#### Ports (`ports/`)
Interfaces for infrastructure dependencies.

```typescript
export interface IIdGenerator {
  generate(): string;
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Implements interfaces defined in domain/application. All I/O happens here.

**Characteristics**:
- Implements repository interfaces
- Contains database clients, HTTP clients, etc.
- Can use any third-party libraries
- Maps between domain models and external formats

**Components**:

#### Database (`database/`)
Database client and migrations.

```typescript
export class DatabaseClient {
  static getInstance(): Pool {
    // PostgreSQL connection pool
  }
}
```

#### Repository Implementations (`repositories/`)
Concrete implementations of repository interfaces.

```typescript
export class PostgresAccountRepository implements IAccountRepository {
  async findById(id: string): Promise<Account | null> {
    const result = await this.pool.query(/* SQL */);
    return this.toDomain(result.rows[0]); // Map DB row to domain entity
  }
  
  private toDomain(row: AccountRow): Account {
    // Transform database row to domain entity
  }
}
```

#### ID Generation (`id-generation/`)
UUID generation implementation.

```typescript
export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
```

### 4. Interfaces Layer (`src/interfaces/`)

**Purpose**: Entry points into the application. Adapts external requests to use case calls.

**Characteristics**:
- Thin layer that delegates to use cases
- Handles HTTP concerns (status codes, headers)
- Validates input
- Serializes output

**Components**:

#### Controllers (`controllers/`)
Orchestrate use case calls, handle errors.

```typescript
export class AccountController {
  async createAccount(data: CreateAccountDTO): Promise<AccountDTO> {
    try {
      const useCase = this.container.getCreateAccountUseCase();
      return await useCase.execute(data);
    } catch (error) {
      // Transform domain errors to HTTP errors
    }
  }
}
```

#### Validation (`validation/`)
Input validation schemas using Zod.

```typescript
export const createAccountSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  // ...
});
```

#### Dependency Injection (`di/`)
Wires up all dependencies.

```typescript
export class Container {
  private accountRepository = new PostgresAccountRepository(this.dbClient);
  private createAccountUseCase = new CreateAccountUseCase(this.accountRepository);
  
  getCreateAccountUseCase(): CreateAccountUseCase {
    return this.createAccountUseCase;
  }
}
```

## Dependency Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Interfaces Layer                     │
│   (API Routes, Controllers, Validation, DI Container)    │
└─────────────────┬───────────────────────────────────────┘
                  │ depends on
                  ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│          (Use Cases, DTOs, Port Interfaces)              │
└─────────────────┬───────────────────────────────────────┘
                  │ depends on
                  ↓
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│   (Entities, Value Objects, Repository Interfaces)       │
└─────────────────────────────────────────────────────────┘
                  ↑
                  │ implements
                  │
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│  (DB Clients, Repository Impls, External Services)       │
└─────────────────────────────────────────────────────────┘
```

## Key Principles

### 1. Dependency Inversion Principle

High-level modules (domain) do not depend on low-level modules (infrastructure). Both depend on abstractions (interfaces).

**Example**:
```typescript
// Domain defines the interface
interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
}

// Infrastructure implements it
class PostgresAccountRepository implements IAccountRepository {
  // Implementation
}

// Application uses the interface
class CreateAccountUseCase {
  constructor(private repo: IAccountRepository) {} // Depends on interface
}
```

### 2. Single Responsibility Principle

Each class has one reason to change.

- **Entities**: Change when business rules change
- **Use Cases**: Change when application workflows change
- **Repositories**: Change when database schema changes
- **Controllers**: Change when API contract changes

### 3. Open/Closed Principle

Open for extension, closed for modification.

**Example**: Adding a new repository implementation doesn't require changing use cases:

```typescript
// Can add MongoDB implementation without changing use cases
class MongoAccountRepository implements IAccountRepository {
  // Different implementation, same interface
}
```

### 4. Liskov Substitution Principle

Any implementation should be substitutable for its interface.

```typescript
// Use case works with any IAccountRepository implementation
const useCase = new CreateAccountUseCase(new PostgresAccountRepository());
// or
const useCase = new CreateAccountUseCase(new InMemoryAccountRepository());
```

## Testing Strategy

### Domain Layer Tests
- Pure unit tests
- No mocks required
- Test business logic in isolation

```typescript
describe('Money', () => {
  it('should add two money values of same currency', () => {
    const money1 = new Money(10, 'USD');
    const money2 = new Money(5, 'USD');
    expect(money1.add(money2).getAmount()).toBe(15);
  });
});
```

### Application Layer Tests
- Mock repositories via interfaces
- Test use case orchestration

```typescript
describe('CreateAccountUseCase', () => {
  it('should create account', async () => {
    const mockRepo = createMock<IAccountRepository>();
    const useCase = new CreateAccountUseCase(mockRepo, mockIdGen);
    // Test
  });
});
```

### Infrastructure Layer Tests
- Integration tests with real database
- Test data mapping

### Interface Layer Tests
- API integration tests
- Test HTTP concerns

## Benefits

### 1. **Testability**
- Business logic tested without database
- Use cases tested with mocked repositories
- Each layer tested independently

### 2. **Maintainability**
- Clear separation of concerns
- Easy to find where changes should go
- Changes in one layer don't ripple to others

### 3. **Flexibility**
- Swap PostgreSQL for MongoDB without changing business logic
- Change API from REST to GraphQL without changing use cases
- Add new frameworks without touching domain

### 4. **Team Collaboration**
- Frontend developers work on interfaces layer
- Backend developers work on infrastructure
- Domain experts work on domain layer
- Minimal conflicts

### 5. **Future-Proofing**
- Business logic survives framework changes
- Can migrate from Next.js to NestJS without rewriting business logic
- Easy to add new interfaces (CLI, GraphQL, gRPC)

## Anti-Patterns to Avoid

### ❌ Skipping Layers
```typescript
// BAD: Controller directly accessing repository
class AccountController {
  async create(data) {
    return await this.accountRepository.save(data); // No business logic!
  }
}
```

### ❌ Domain Dependencies
```typescript
// BAD: Domain importing infrastructure
import { Pool } from 'pg'; // ❌ Domain should not know about database

export class Account {
  async save() {
    // ❌ Domain should not do I/O
  }
}
```

### ❌ Business Logic in Controllers
```typescript
// BAD: Business logic in controller
class AccountController {
  async create(data) {
    if (data.balance < 0) { // ❌ Business rule in controller
      throw new Error('Invalid balance');
    }
  }
}
```

### ❌ Returning Entities from API
```typescript
// BAD: Returning domain entity
return NextResponse.json(account); // ❌ Should return DTO

// GOOD: Returning DTO
return NextResponse.json(this.toDTO(account));
```

## Further Reading

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
