# ✅ Ledger Project Checklist

This checklist helps verify the project is properly set up and follows clean architecture principles.

## 📦 Initial Setup

- [ ] `.env` file created from `.env.example`
- [ ] Dependencies installed (`npm install`)
- [ ] Docker containers running (`docker ps` shows postgres)
- [ ] Database migrations completed successfully
- [ ] Development server starts without errors (`npm run dev`)
- [ ] Welcome page loads at `http://localhost:3000`
- [ ] Health check endpoint returns healthy status

## 🏗️ Architecture Compliance

### Domain Layer (`src/domain/`)

- [ ] **No external dependencies** (only TypeScript native types)
- [ ] **No imports** from `application/`, `infrastructure/`, or `interfaces/`
- [ ] **Entities** validate their own invariants in constructors
- [ ] **Value Objects** are immutable
- [ ] **Repository interfaces** define contracts (no implementations)
- [ ] **Domain services** contain multi-entity business logic
- [ ] No `process.env` usage
- [ ] No database/HTTP/framework imports
- [ ] All business rules enforced here

Files Present:
- [ ] `entities/Account.ts`
- [ ] `entities/Transaction.ts`
- [ ] `value-objects/Money.ts`
- [ ] `value-objects/TransactionType.ts`
- [ ] `value-objects/AccountType.ts`
- [ ] `repositories/IAccountRepository.ts`
- [ ] `repositories/ITransactionRepository.ts`
- [ ] `services/TransactionService.ts`

### Application Layer (`src/application/`)

- [ ] **Imports only from domain** layer
- [ ] **One use case per file**
- [ ] Each use case has single `execute()` method
- [ ] Use cases receive dependencies via constructor
- [ ] Use cases return DTOs (not domain entities)
- [ ] DTOs use primitive types only
- [ ] Port interfaces defined for infrastructure dependencies
- [ ] No business logic (delegates to domain)

Files Present:
- [ ] `use-cases/CreateAccountUseCase.ts`
- [ ] `use-cases/GetAccountsByUserUseCase.ts`
- [ ] `use-cases/CreateTransactionUseCase.ts`
- [ ] `use-cases/GetTransactionsUseCase.ts`
- [ ] `dtos/CreateAccountDTO.ts`
- [ ] `dtos/AccountDTO.ts`
- [ ] `dtos/CreateTransactionDTO.ts`
- [ ] `dtos/TransactionDTO.ts`
- [ ] `dtos/GetTransactionsDTO.ts`
- [ ] `ports/IIdGenerator.ts`

### Infrastructure Layer (`src/infrastructure/`)

- [ ] **Implements domain/application interfaces**
- [ ] Can import from domain and application layers
- [ ] Contains all I/O operations
- [ ] Maps database rows to domain entities
- [ ] No business logic
- [ ] Uses `process.env` for configuration
- [ ] Third-party library usage allowed

Files Present:
- [ ] `database/client.ts`
- [ ] `database/migrations/001_create_accounts_table.sql`
- [ ] `database/migrations/002_create_transactions_table.sql`
- [ ] `repositories/PostgresAccountRepository.ts`
- [ ] `repositories/PostgresTransactionRepository.ts`
- [ ] `id-generation/UuidGenerator.ts`
- [ ] `config/DatabaseConfig.ts`

### Interfaces Layer (`src/interfaces/`)

- [ ] **Imports only from application** layer
- [ ] Controllers are thin (validate → use case → response)
- [ ] Input validation with Zod schemas
- [ ] Never returns domain entities (uses DTOs)
- [ ] Never calls repositories directly
- [ ] Handles HTTP concerns (status codes, headers)
- [ ] Error handling and transformation

Files Present:
- [ ] `controllers/AccountController.ts`
- [ ] `controllers/TransactionController.ts`
- [ ] `validation/accountSchemas.ts`
- [ ] `validation/transactionSchemas.ts`
- [ ] `di/container.ts`

### Next.js App (`src/app/`)

- [ ] API routes defined in `app/api/`
- [ ] Routes delegate to controllers
- [ ] No business logic in route handlers
- [ ] Proper HTTP status codes returned
- [ ] Error responses formatted consistently

Files Present:
- [ ] `api/accounts/route.ts`
- [ ] `api/transactions/route.ts`
- [ ] `api/health/route.ts`
- [ ] `layout.tsx`
- [ ] `page.tsx`
- [ ] `globals.css`

## 🧪 Code Quality

- [ ] **TypeScript strict mode** enabled in `tsconfig.json`
- [ ] **No `any` types** used anywhere
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript type check passes (`npm run type-check`)
- [ ] Prettier formatting passes (`npm run format:check`)
- [ ] All files use consistent naming conventions
- [ ] Path aliases configured (`@domain/`, `@application/`, etc.)

## 🐳 Docker & Database

- [ ] `docker-compose.yml` properly configured
- [ ] `Dockerfile` builds successfully
- [ ] PostgreSQL starts and accepts connections
- [ ] Database migrations run successfully
- [ ] Tables created correctly
- [ ] Indexes created on foreign keys
- [ ] Connection pooling configured

## 📚 Documentation

- [ ] `README.md` with setup instructions
- [ ] `QUICKSTART.md` for fast setup
- [ ] `PROJECT_SUMMARY.md` with overview
- [ ] `CONTRIBUTING.md` with guidelines
- [ ] `docs/API.md` with endpoint documentation
- [ ] `docs/ARCHITECTURE.md` with architecture details
- [ ] `docs/EXAMPLES.md` with usage examples
- [ ] `docs/LAYERS.md` with layer visualization
- [ ] All CLAUDE.md files present in layers

## 🔧 Configuration Files

- [ ] `package.json` with all scripts
- [ ] `tsconfig.json` with strict settings
- [ ] `.eslintrc.json` configured
- [ ] `.prettierrc` configured
- [ ] `.gitignore` includes node_modules, .env, etc.
- [ ] `.dockerignore` configured
- [ ] `.editorconfig` for consistent formatting
- [ ] `.npmrc` with settings
- [ ] `.env.example` with all variables
- [ ] `next.config.js` configured
- [ ] `next-env.d.ts` present

## 🧩 Dependency Injection

- [ ] Container wires all dependencies
- [ ] Use cases receive interfaces, not implementations
- [ ] Repository implementations injected via interfaces
- [ ] ID generator injected via interface
- [ ] Domain services instantiated correctly

## 🔒 Business Rules Implementation

### Account Rules
- [ ] Account ID is required and validated
- [ ] User ID is required and validated
- [ ] Account name is required (max 100 chars)
- [ ] Balance stored with Money value object
- [ ] Account type validated (CHECKING, SAVINGS, etc.)
- [ ] Active status tracked

### Transaction Rules
- [ ] Transaction must belong to existing account
- [ ] Amount must be positive
- [ ] Currency must be 3-letter code
- [ ] Description required (max 500 chars)
- [ ] Transaction date cannot be in future
- [ ] Debit requires sufficient balance
- [ ] Credit requires active account

### Money Rules
- [ ] Operations maintain currency consistency
- [ ] Amounts rounded to 2 decimal places
- [ ] Cannot mix different currencies
- [ ] Proper validation of numeric values

## 🚀 API Functionality

### Accounts
- [ ] POST `/api/accounts` creates account
- [ ] GET `/api/accounts?userId={id}` returns user accounts
- [ ] Proper validation errors returned
- [ ] 201 status for successful creation
- [ ] 400 status for validation errors
- [ ] 500 status for server errors

### Transactions
- [ ] POST `/api/transactions` creates transaction
- [ ] GET `/api/transactions?accountId={id}` returns transactions
- [ ] Pagination works (limit/offset)
- [ ] Transactions sorted by date (descending)
- [ ] Business rule violations return proper errors
- [ ] Insufficient funds error handled

### Health Check
- [ ] GET `/api/health` returns status
- [ ] Database connection checked
- [ ] Returns 503 if database unavailable

## 📝 Testing Readiness

While tests aren't included, architecture supports:
- [ ] Domain layer can be unit tested without mocks
- [ ] Use cases can be tested with mocked repositories
- [ ] Repository implementations can be integration tested
- [ ] API endpoints can be E2E tested
- [ ] Each layer independently testable

## 🔄 Data Flow Verification

- [ ] Request → Route → Controller → Use Case → Domain → Repository → Database
- [ ] Response follows reverse path
- [ ] DTOs used for layer boundaries
- [ ] Entities don't leak to outer layers
- [ ] Validation happens at appropriate layers

## 🎯 Clean Architecture Principles

- [ ] **Dependency Rule**: All dependencies point inward
- [ ] **Single Responsibility**: Each class has one reason to change
- [ ] **Open/Closed**: Open for extension, closed for modification
- [ ] **Liskov Substitution**: Implementations are interchangeable
- [ ] **Interface Segregation**: Focused interfaces
- [ ] **Dependency Inversion**: Depend on abstractions, not concretions

## 🌟 Production Readiness

- [ ] Environment variables not hardcoded
- [ ] Database connection pooling configured
- [ ] Error handling implemented throughout
- [ ] Proper HTTP status codes used
- [ ] Input validation on all endpoints
- [ ] No console.log in production code
- [ ] Docker setup for deployment
- [ ] Migrations can be run independently

## 📊 Repository Pattern Implementation

- [ ] Interfaces defined in domain
- [ ] Implementations in infrastructure
- [ ] Methods return domain entities
- [ ] Database mapping isolated in repositories
- [ ] Queries don't leak to application layer

## 🎨 Value Objects Implementation

- [ ] Immutable (no setters)
- [ ] Validation in constructor
- [ ] Equality by value
- [ ] Operations return new instances
- [ ] Type safety enforced

## ⚡ Performance Considerations

- [ ] Database indexes on foreign keys
- [ ] Connection pooling enabled
- [ ] Pagination implemented for lists
- [ ] No N+1 query problems
- [ ] Proper use of async/await

## 🔐 Security Basics

Note: Authentication not included in boilerplate, but architecture supports:
- [ ] Input validation prevents injection
- [ ] SQL uses parameterized queries
- [ ] No sensitive data in logs
- [ ] Environment variables used for secrets
- [ ] CORS configured (can be adjusted)

## 📈 Monitoring & Observability

Foundation ready for:
- [ ] Logging can be added to infrastructure
- [ ] Health check endpoint exists
- [ ] Error handling structure in place
- [ ] Request tracing can be added

## 🎓 Learning & Documentation

- [ ] Architecture clearly explained
- [ ] Examples provided
- [ ] Layer responsibilities documented
- [ ] Best practices outlined
- [ ] Anti-patterns identified
- [ ] Contributing guidelines clear

---

## Final Verification

Run all checks:

```bash
# Install dependencies
npm install

# Check types
npm run type-check

# Check linting
npm run lint

# Check formatting
npm run format:check

# Start Docker
npm run docker:up

# Run migrations
npm run db:migrate

# Start dev server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Test create account
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","name":"Test","type":"CHECKING","initialBalance":100,"currency":"USD"}'
```

If all steps pass, you have a fully functional clean architecture boilerplate! ✅

## Common Issues Checklist

- [ ] If TypeScript errors: Check path aliases in `tsconfig.json`
- [ ] If database errors: Verify Docker is running and migrations ran
- [ ] If import errors: Check layer boundaries are respected
- [ ] If build errors: Run `npm run type-check` for details
- [ ] If Docker errors: Check ports 3000 and 5432 are available

---

**When all items are checked, your project follows clean architecture principles! 🎉**
