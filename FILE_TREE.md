# 📂 Complete File Tree

```
ledger/
│
├── 📄 Configuration Files
│   ├── package.json                          # Dependencies and scripts
│   ├── tsconfig.json                         # TypeScript configuration
│   ├── next.config.js                        # Next.js configuration
│   ├── .eslintrc.json                        # ESLint rules
│   ├── .prettierrc                           # Prettier formatting
│   ├── .gitignore                            # Git ignore rules
│   ├── .dockerignore                         # Docker ignore rules
│   ├── .editorconfig                         # Editor configuration
│   ├── .npmrc                                # npm configuration
│   ├── .env.example                          # Environment variables template
│   └── next-env.d.ts                         # Next.js TypeScript definitions
│
├── 🐳 Docker Configuration
│   ├── Dockerfile                            # Production container
│   └── docker-compose.yml                    # Docker orchestration
│
├── 📚 Documentation
│   ├── README.md                             # Main documentation
│   ├── QUICKSTART.md                         # Quick setup guide
│   ├── PROJECT_SUMMARY.md                    # Project overview
│   ├── CONTRIBUTING.md                       # Contribution guidelines
│   ├── CHECKLIST.md                          # Verification checklist
│   ├── FILE_TREE.md                          # This file
│   ├── CLAUDE.md                             # Architecture contract
│   ├── architecture.json                     # Machine-readable rules
│   └── docs/
│       ├── API.md                            # API documentation
│       ├── ARCHITECTURE.md                   # Architecture deep dive
│       ├── EXAMPLES.md                       # Usage examples
│       └── LAYERS.md                         # Layer visualization
│
├── 🔧 Scripts
│   ├── setup.sh                              # Setup automation script
│   └── migrate.ts                            # Database migration runner
│
├── 🌐 Public Assets
│   └── .gitkeep                              # Keep directory in git
│
├── 🏗️ Source Code (src/)
│   │
│   ├── 📱 Next.js App (app/)
│   │   ├── layout.tsx                        # Root layout
│   │   ├── page.tsx                          # Home page
│   │   ├── globals.css                       # Global styles
│   │   └── api/                              # API Routes
│   │       ├── accounts/
│   │       │   └── route.ts                  # Account endpoints
│   │       ├── transactions/
│   │       │   └── route.ts                  # Transaction endpoints
│   │       └── health/
│   │           └── route.ts                  # Health check endpoint
│   │
│   ├── 🔵 DOMAIN LAYER (domain/)
│   │   │   ❌ NO external dependencies
│   │   │   ❌ NO imports from other layers
│   │   │   ✅ Pure business logic
│   │   │
│   │   ├── CLAUDE.md                         # Domain layer rules
│   │   │
│   │   ├── entities/                         # Business Objects with Identity
│   │   │   ├── Account.ts                    # Account entity
│   │   │   │   • Properties: id, userId, name, type, balance, isActive
│   │   │   │   • Methods: canDebit(), canCredit()
│   │   │   │   • Validation in constructor
│   │   │   └── Transaction.ts                # Transaction entity
│   │   │       • Properties: id, accountId, amount, type, description, date
│   │   │       • Methods: isDebit(), isCredit()
│   │   │       • Business rule enforcement
│   │   │
│   │   ├── value-objects/                    # Immutable Values
│   │   │   ├── Money.ts                      # Monetary value + currency
│   │   │   │   • Operations: add, subtract, multiply
│   │   │   │   • Currency validation
│   │   │   │   • Comparison methods
│   │   │   ├── TransactionType.ts            # DEBIT or CREDIT
│   │   │   │   • Type-safe enum pattern
│   │   │   │   • Factory methods
│   │   │   └── AccountType.ts                # Account type enum
│   │   │       • CHECKING, SAVINGS, CREDIT, INVESTMENT
│   │   │       • Type-safe pattern
│   │   │
│   │   ├── repositories/                     # Repository Interfaces (Contracts)
│   │   │   ├── IAccountRepository.ts         # Account persistence contract
│   │   │   │   • findById, findByUserId, save, update, delete
│   │   │   └── ITransactionRepository.ts     # Transaction persistence contract
│   │   │       • findById, findByAccountId, save, delete, count
│   │   │       • Pagination support
│   │   │
│   │   └── services/                         # Domain Services
│   │       └── TransactionService.ts         # Multi-entity business logic
│   │           • applyTransactionToAccount()
│   │           • calculateBalance()
│   │
│   ├── 🟢 APPLICATION LAYER (application/)
│   │   │   ✅ Imports from domain only
│   │   │   ❌ NO infrastructure imports
│   │   │   ✅ Orchestrates domain objects
│   │   │
│   │   ├── CLAUDE.md                         # Application layer rules
│   │   │
│   │   ├── use-cases/                        # Business Workflows
│   │   │   ├── CreateAccountUseCase.ts       # Create new account
│   │   │   │   • execute(CreateAccountDTO) → AccountDTO
│   │   │   │   • Validates input, creates entity, persists
│   │   │   ├── GetAccountsByUserUseCase.ts   # Fetch user accounts
│   │   │   │   • execute(userId) → AccountDTO[]
│   │   │   ├── CreateTransactionUseCase.ts   # Create transaction
│   │   │   │   • execute(CreateTransactionDTO) → TransactionDTO
│   │   │   │   • Validates business rules via domain service
│   │   │   └── GetTransactionsUseCase.ts     # Fetch transactions
│   │   │       • execute(GetTransactionsDTO) → TransactionDTO[]
│   │   │       • Supports pagination
│   │   │
│   │   ├── dtos/                             # Data Transfer Objects
│   │   │   ├── CreateAccountDTO.ts           # Input for account creation
│   │   │   ├── AccountDTO.ts                 # Account output
│   │   │   ├── CreateTransactionDTO.ts       # Input for transaction creation
│   │   │   ├── TransactionDTO.ts             # Transaction output
│   │   │   └── GetTransactionsDTO.ts         # Query parameters
│   │   │
│   │   └── ports/                            # Infrastructure Abstractions
│   │       └── IIdGenerator.ts               # ID generation interface
│   │
│   ├── 🟡 INFRASTRUCTURE LAYER (infrastructure/)
│   │   │   ✅ Implements domain/application interfaces
│   │   │   ✅ Can import from domain & application
│   │   │   ✅ All I/O operations here
│   │   │   ✅ Third-party libraries allowed
│   │   │
│   │   ├── CLAUDE.md                         # Infrastructure layer rules
│   │   │
│   │   ├── database/                         # Database Management
│   │   │   ├── client.ts                     # PostgreSQL connection pool
│   │   │   │   • Singleton pattern
│   │   │   │   • Connection pooling
│   │   │   └── migrations/                   # SQL Migrations
│   │   │       ├── 001_create_accounts_table.sql
│   │   │       │   • Accounts table schema
│   │   │       │   • Indexes on user_id
│   │   │       └── 002_create_transactions_table.sql
│   │   │           • Transactions table schema
│   │   │           • Foreign key to accounts
│   │   │           • Indexes for queries
│   │   │
│   │   ├── repositories/                     # Repository Implementations
│   │   │   ├── PostgresAccountRepository.ts  # Account persistence
│   │   │   │   • Implements IAccountRepository
│   │   │   │   • Maps DB rows ↔ domain entities
│   │   │   │   • SQL queries
│   │   │   └── PostgresTransactionRepository.ts # Transaction persistence
│   │   │       • Implements ITransactionRepository
│   │   │       • Maps DB rows ↔ domain entities
│   │   │       • Pagination queries
│   │   │
│   │   ├── id-generation/                    # ID Generation
│   │   │   └── UuidGenerator.ts              # UUID v4 generator
│   │   │       • Implements IIdGenerator
│   │   │
│   │   └── config/                           # Configuration
│   │       └── DatabaseConfig.ts             # Database configuration
│   │           • Reads from process.env
│   │           • Environment detection
│   │
│   └── 🔴 INTERFACES LAYER (interfaces/)
│       │   ✅ Imports from application only
│       │   ❌ NO domain imports (use DTOs)
│       │   ❌ NO infrastructure imports
│       │   ✅ Thin adapter layer
│       │
│       ├── CLAUDE.md                         # Interfaces layer rules
│       │
│       ├── controllers/                      # Request Handlers
│       │   ├── AccountController.ts          # Account operations
│       │   │   • createAccount(dto)
│       │   │   • getAccountsByUser(userId)
│       │   │   • Delegates to use cases
│       │   └── TransactionController.ts      # Transaction operations
│       │       • createTransaction(dto)
│       │       • getTransactions(params)
│       │       • Error transformation
│       │
│       ├── validation/                       # Input Validation
│       │   ├── accountSchemas.ts             # Zod schemas for accounts
│       │   │   • createAccountSchema
│       │   │   • getUserAccountsSchema
│       │   └── transactionSchemas.ts         # Zod schemas for transactions
│       │       • createTransactionSchema
│       │       • getTransactionsSchema
│       │
│       └── di/                               # Dependency Injection
│           └── container.ts                  # DI Container
│               • Wires all dependencies
│               • Singleton instances
│               • Use case factory methods
│
└── 🔄 CI/CD
    └── .github/
        └── workflows/
            └── ci.yml                        # GitHub Actions CI pipeline
                • Lint and type check
                • Build verification
                • Docker build test

```

## 📊 Layer Dependencies

```
┌─────────────────────────────────────────────────┐
│  interfaces/                                    │
│  • Controllers call use cases                   │
│  • Validation with Zod                          │
│  • DI container                                 │
└─────────────┬───────────────────────────────────┘
              │ depends on ↓
┌─────────────┴───────────────────────────────────┐
│  application/                                   │
│  • Use cases orchestrate domain                 │
│  • DTOs for data transfer                       │
│  • Port interfaces                              │
└─────────────┬───────────────────────────────────┘
              │ depends on ↓
┌─────────────┴───────────────────────────────────┐
│  domain/                                        │
│  • Pure business logic                          │
│  • Zero external dependencies                   │
│  • Repository interfaces                        │
└─────────────────────────────────────────────────┘
              ↑ implements
┌─────────────┴───────────────────────────────────┐
│  infrastructure/                                │
│  • Repository implementations                   │
│  • Database client                              │
│  • External services                            │
└─────────────────────────────────────────────────┘
```

## 📈 File Count by Layer

- **Domain**: 8 files (entities, value objects, repositories, services)
- **Application**: 10 files (use cases, DTOs, ports)
- **Infrastructure**: 7 files (database, repositories, config)
- **Interfaces**: 6 files (controllers, validation, DI)
- **App**: 6 files (routes, pages, layout)
- **Documentation**: 13 files
- **Configuration**: 11 files
- **Scripts**: 2 files

**Total Source Files**: ~63 files

## 🎯 Key Files to Start With

1. **Understanding Architecture**:
   - `CLAUDE.md` - Architecture overview
   - `docs/ARCHITECTURE.md` - Detailed explanation
   - `docs/LAYERS.md` - Layer visualization

2. **Getting Started**:
   - `QUICKSTART.md` - Fast setup guide
   - `README.md` - Complete documentation
   - `.env.example` - Environment setup

3. **Domain Logic**:
   - `src/domain/entities/Account.ts` - Core entity
   - `src/domain/value-objects/Money.ts` - Value object pattern
   - `src/domain/services/TransactionService.ts` - Domain service

4. **Use Cases**:
   - `src/application/use-cases/CreateAccountUseCase.ts` - Use case pattern
   - `src/application/dtos/AccountDTO.ts` - DTO pattern

5. **API**:
   - `src/app/api/accounts/route.ts` - API endpoint
   - `src/interfaces/controllers/AccountController.ts` - Controller pattern

## 🔍 Finding Things

### "Where do I add...?"

| What | Where | Files |
|------|-------|-------|
| Business rule | Domain | `src/domain/entities/*.ts` |
| New workflow | Application | `src/application/use-cases/*.ts` |
| Database query | Infrastructure | `src/infrastructure/repositories/*.ts` |
| API endpoint | Interfaces + App | `src/app/api/*/route.ts` |
| Validation | Interfaces | `src/interfaces/validation/*.ts` |
| Configuration | Infrastructure | `src/infrastructure/config/*.ts` |

### "What does this file do?"

| File | Purpose |
|------|---------|
| `Account.ts` | Core account entity with business rules |
| `Money.ts` | Immutable monetary value object |
| `CreateAccountUseCase.ts` | Business workflow for creating accounts |
| `AccountDTO.ts` | Data transfer object for API responses |
| `PostgresAccountRepository.ts` | Database persistence implementation |
| `AccountController.ts` | HTTP request handler |
| `container.ts` | Dependency injection setup |
| `route.ts` | Next.js API endpoint |

## 📝 Naming Conventions

- **Entities**: `PascalCase.ts` (e.g., `Account.ts`)
- **Value Objects**: `PascalCase.ts` (e.g., `Money.ts`)
- **Use Cases**: `PascalCaseUseCase.ts` (e.g., `CreateAccountUseCase.ts`)
- **DTOs**: `PascalCaseDTO.ts` (e.g., `AccountDTO.ts`)
- **Interfaces**: `IPascalCase.ts` (e.g., `IAccountRepository.ts`)
- **Implementations**: `PrefixPascalCase.ts` (e.g., `PostgresAccountRepository.ts`)
- **Routes**: `route.ts` (Next.js convention)
- **Config**: `lowercase.ts` or `PascalCase.ts`

## 🎨 File Organization Principles

1. **One class per file** (with same name)
2. **Group by layer**, then by feature
3. **Clear naming** indicates purpose
4. **Index files** avoided (explicit imports)
5. **Separation of concerns** maintained
6. **Test files** would mirror source structure (not included)

---

**Use this file tree as a reference when navigating the project!**
