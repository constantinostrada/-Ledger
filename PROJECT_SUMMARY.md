# Ledger - Project Summary

## 🎯 Project Overview

**Ledger** is a production-ready financial transaction management system demonstrating Clean Architecture principles in a modern TypeScript/Next.js application.

## 📦 Technology Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Validation**: Zod
- **Code Quality**: ESLint, Prettier
- **Architecture**: Clean Architecture (4 layers)

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────┐
│         INTERFACES (Entry Points)           │
│  API Routes • Controllers • Validation      │
└─────────────────┬───────────────────────────┘
                  ↓ depends on
┌─────────────────────────────────────────────┐
│        APPLICATION (Use Cases)              │
│   Business Workflows • DTOs • Ports         │
└─────────────────┬───────────────────────────┘
                  ↓ depends on
┌─────────────────────────────────────────────┐
│          DOMAIN (Business Logic)            │
│  Entities • Value Objects • Interfaces      │
└─────────────────────────────────────────────┘
                  ↑ implements
┌─────────────────────────────────────────────┐
│      INFRASTRUCTURE (External I/O)          │
│  Database • Repositories • ID Generation    │
└─────────────────────────────────────────────┘
```

## 📁 Project Structure

```
.
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── api/                  # API endpoints
│   │   │   ├── accounts/         # Account endpoints
│   │   │   ├── transactions/     # Transaction endpoints
│   │   │   └── health/           # Health check
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── domain/                   # 🔵 DOMAIN LAYER
│   │   ├── entities/
│   │   │   ├── Account.ts        # Account entity
│   │   │   └── Transaction.ts    # Transaction entity
│   │   ├── value-objects/
│   │   │   ├── Money.ts          # Money value object
│   │   │   ├── AccountType.ts    # Account type enum
│   │   │   └── TransactionType.ts # Transaction type enum
│   │   ├── repositories/
│   │   │   ├── IAccountRepository.ts
│   │   │   └── ITransactionRepository.ts
│   │   ├── services/
│   │   │   └── TransactionService.ts # Domain service
│   │   └── CLAUDE.md
│   │
│   ├── application/              # 🟢 APPLICATION LAYER
│   │   ├── use-cases/
│   │   │   ├── CreateAccountUseCase.ts
│   │   │   ├── GetAccountsByUserUseCase.ts
│   │   │   ├── CreateTransactionUseCase.ts
│   │   │   └── GetTransactionsUseCase.ts
│   │   ├── dtos/
│   │   │   ├── CreateAccountDTO.ts
│   │   │   ├── AccountDTO.ts
│   │   │   ├── CreateTransactionDTO.ts
│   │   │   ├── TransactionDTO.ts
│   │   │   └── GetTransactionsDTO.ts
│   │   ├── ports/
│   │   │   └── IIdGenerator.ts
│   │   └── CLAUDE.md
│   │
│   ├── infrastructure/           # 🟡 INFRASTRUCTURE LAYER
│   │   ├── database/
│   │   │   ├── client.ts         # PostgreSQL client
│   │   │   └── migrations/
│   │   │       ├── 001_create_accounts_table.sql
│   │   │       └── 002_create_transactions_table.sql
│   │   ├── repositories/
│   │   │   ├── PostgresAccountRepository.ts
│   │   │   └── PostgresTransactionRepository.ts
│   │   ├── id-generation/
│   │   │   └── UuidGenerator.ts
│   │   ├── config/
│   │   │   └── DatabaseConfig.ts
│   │   └── CLAUDE.md
│   │
│   └── interfaces/               # 🔴 INTERFACES LAYER
│       ├── controllers/
│       │   ├── AccountController.ts
│       │   └── TransactionController.ts
│       ├── validation/
│       │   ├── accountSchemas.ts
│       │   └── transactionSchemas.ts
│       ├── di/
│       │   └── container.ts      # Dependency injection
│       └── CLAUDE.md
│
├── scripts/
│   ├── setup.sh                  # Setup script
│   └── migrate.ts                # Migration runner
│
├── docs/
│   ├── API.md                    # API documentation
│   ├── ARCHITECTURE.md           # Architecture details
│   └── EXAMPLES.md               # Usage examples
│
├── docker-compose.yml            # Docker orchestration
├── Dockerfile                    # Production container
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
├── .eslintrc.json               # ESLint config
├── .prettierrc                   # Prettier config
├── .env.example                  # Environment template
├── README.md                     # Main documentation
├── CONTRIBUTING.md               # Contribution guide
├── CLAUDE.md                     # Architecture contract
└── architecture.json             # Machine-readable rules
```

## 🎨 Domain Model

### Entities

**Account**
- Represents a financial account (checking, savings, credit, investment)
- Enforces business rules (account validation, balance checks)
- Properties: id, userId, name, type, balance, isActive

**Transaction**
- Represents a financial transaction (debit or credit)
- Enforces business rules (date validation, description requirements)
- Properties: id, accountId, amount, type, description, date

### Value Objects

**Money**
- Immutable monetary value with currency
- Operations: add, subtract, multiply
- Currency validation and comparison

**TransactionType**
- DEBIT or CREDIT
- Type-safe enum pattern

**AccountType**
- CHECKING, SAVINGS, CREDIT, INVESTMENT
- Type-safe enum pattern

### Repository Interfaces

- `IAccountRepository` - Account persistence contract
- `ITransactionRepository` - Transaction persistence contract

### Domain Services

- `TransactionService` - Multi-entity business logic

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Create a new account |
| GET | `/api/accounts?userId={id}` | Get user accounts |
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions?accountId={id}` | Get account transactions |
| GET | `/api/health` | Health check |

## 🚀 Quick Start

### 1. Setup

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start PostgreSQL
npm run docker:up

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### 2. Create an Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "name": "My Checking",
    "type": "CHECKING",
    "initialBalance": 1000,
    "currency": "USD"
  }'
```

### 3. Create a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "account-id-here",
    "amount": 50,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Grocery shopping",
    "date": "2024-01-15T10:00:00Z"
  }'
```

## 🧪 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run docker:up    # Start Docker containers
npm run docker:down  # Stop Docker containers
npm run prisma:migrate   # Run database migrations
```

## ✅ Clean Architecture Compliance

### Domain Layer ✅
- ✅ Zero external dependencies
- ✅ Pure business logic
- ✅ No infrastructure imports
- ✅ Repository interfaces defined here

### Application Layer ✅
- ✅ Depends only on domain
- ✅ One use case per file
- ✅ Uses dependency injection
- ✅ Returns DTOs, not entities

### Infrastructure Layer ✅
- ✅ Implements domain interfaces
- ✅ Contains all I/O operations
- ✅ Maps DB models to domain entities
- ✅ No business logic

### Interfaces Layer ✅
- ✅ Thin controllers
- ✅ Input validation with Zod
- ✅ Calls use cases only
- ✅ HTTP concerns isolated here

## 🎯 Design Principles Applied

1. **Dependency Inversion Principle** - High-level modules don't depend on low-level modules
2. **Single Responsibility Principle** - Each class has one reason to change
3. **Open/Closed Principle** - Open for extension, closed for modification
4. **Interface Segregation Principle** - Clients depend on focused interfaces
5. **Liskov Substitution Principle** - Implementations are interchangeable

## 🛡️ Type Safety

- **Strict TypeScript** mode enabled
- **No `any` types** enforced by ESLint
- **Zod validation** for runtime type safety
- **Type-safe DTOs** for layer boundaries

## 📚 Documentation

- **README.md** - Quick start and overview
- **docs/API.md** - Complete API reference
- **docs/ARCHITECTURE.md** - Deep dive into architecture
- **docs/EXAMPLES.md** - Practical usage examples
- **CONTRIBUTING.md** - Development guidelines
- **CLAUDE.md** - AI-readable architecture contract

## 🔄 Data Flow Example

```
1. HTTP Request → API Route Handler
   ↓
2. Validation (Zod Schema)
   ↓
3. Controller → Use Case
   ↓
4. Use Case → Domain Entities/Services
   ↓
5. Repository Interface
   ↓
6. Repository Implementation → Database
   ↓
7. Domain Entity ← Database Row
   ↓
8. DTO ← Use Case
   ↓
9. JSON Response ← Controller
```

## 🧩 Key Features

- ✅ **Clean Architecture** - Proper layer separation
- ✅ **Type-Safe** - Strict TypeScript throughout
- ✅ **Validated** - Zod schemas for input validation
- ✅ **Dockerized** - Full Docker setup included
- ✅ **Production-Ready** - Proper error handling and logging structure
- ✅ **Well-Documented** - Comprehensive documentation
- ✅ **Testable** - Architecture enables easy testing
- ✅ **Maintainable** - Clear separation of concerns

## 🎓 Learning Resources

This boilerplate demonstrates:
- Clean Architecture in TypeScript
- Next.js App Router with API routes
- PostgreSQL with Node.js
- Dependency Injection patterns
- Domain-Driven Design concepts
- Repository pattern
- Value Objects
- Use Case pattern

## 📝 Next Steps

1. **Add Authentication** - JWT, OAuth, or session-based
2. **Add Tests** - Unit, integration, and E2E tests
3. **Add Logging** - Structured logging with Winston or Pino
4. **Add Caching** - Redis for performance
5. **Add Message Queue** - For async operations
6. **Add GraphQL** - Alternative API interface
7. **Add WebSocket** - Real-time updates

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on maintaining clean architecture principles.

## 📄 License

MIT License - Free to use for any purpose.

---

**Built with Clean Architecture principles for maximum maintainability and testability.**
