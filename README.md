# Ledger

A production-ready financial transaction management system built with Next.js, TypeScript, PostgreSQL, and Docker, following Clean Architecture principles.

## 🏗️ Architecture

This project strictly follows Clean Architecture with four distinct layers:

### Layer Structure

```
src/
├── domain/              → Business Logic Core (No external dependencies)
│   ├── entities/        → Business objects with identity
│   ├── value-objects/   → Immutable values (Money, TransactionType, etc.)
│   ├── repositories/    → Repository interfaces (contracts only)
│   └── services/        → Domain services for complex business logic
│
├── application/         → Use Cases & Application Logic
│   ├── use-cases/       → Business workflows (one per file)
│   ├── dtos/            → Data Transfer Objects
│   └── ports/           → Interfaces for external dependencies
│
├── infrastructure/      → External Concerns & I/O
│   ├── database/        → PostgreSQL client and migrations
│   ├── repositories/    → Repository implementations
│   ├── id-generation/   → UUID generation
│   └── config/          → Environment configuration
│
└── interfaces/          → Entry Points & Adapters
    ├── controllers/     → Request handlers
    ├── validation/      → Input validation schemas
    └── di/              → Dependency injection container
```

### Dependency Rule

**All dependencies point inward:**

```
interfaces → application → domain
infrastructure → application → domain
```

- **Domain layer** has ZERO external dependencies
- **Application layer** depends only on domain
- **Infrastructure** implements interfaces defined in domain/application
- **Interfaces** orchestrates use cases, never contains business logic

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start PostgreSQL with Docker:
   ```bash
   npm run docker:up
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

Build and run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Next.js application on port 3000

## 📡 API Endpoints

### Accounts

**Create Account**
```bash
POST /api/accounts
Content-Type: application/json

{
  "userId": "user-123",
  "name": "My Checking Account",
  "type": "CHECKING",
  "initialBalance": 1000.00,
  "currency": "USD"
}
```

**Get User Accounts**
```bash
GET /api/accounts?userId=user-123
```

### Transactions

**Create Transaction**
```bash
POST /api/transactions
Content-Type: application/json

{
  "accountId": "account-123",
  "amount": 50.00,
  "currency": "USD",
  "type": "DEBIT",
  "description": "Grocery shopping",
  "date": "2024-01-15T10:30:00Z"
}
```

**Get Account Transactions**
```bash
GET /api/transactions?accountId=account-123&limit=50&offset=0
```

### Health Check

```bash
GET /api/health
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler checks
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Quality

This project enforces strict code quality standards:

- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Prettier** for code formatting
- **No `any` types** - enforced by ESLint
- **Clean Architecture** - enforced by layer contracts

## 🏛️ Domain Model

### Entities

- **Account** - User financial account with balance
- **Transaction** - Financial transaction (debit/credit)

### Value Objects

- **Money** - Immutable monetary value with currency
- **TransactionType** - DEBIT or CREDIT
- **AccountType** - CHECKING, SAVINGS, CREDIT, or INVESTMENT

### Business Rules

1. Transactions must belong to an existing account
2. Debit transactions require sufficient balance
3. All monetary operations maintain currency consistency
4. Transaction dates cannot be in the future
5. Inactive accounts cannot accept transactions

## 📁 Project Structure

```
.
├── src/
│   ├── app/                 # Next.js app router
│   ├── domain/              # Business logic (pure)
│   ├── application/         # Use cases
│   ├── infrastructure/      # External services
│   └── interfaces/          # Controllers & routes
├── docker-compose.yml       # Docker orchestration
├── Dockerfile               # Container definition
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies

```

## 🧪 Testing Strategy

While tests are not included in this boilerplate, the clean architecture makes testing straightforward:

- **Domain tests** - Pure unit tests, no mocks needed
- **Application tests** - Mock repositories and services
- **Infrastructure tests** - Integration tests with real database
- **Interface tests** - API endpoint tests

## 📝 Architecture Guidelines

### DO ✅

- Place entities and value objects in `domain/`
- Define repository interfaces in `domain/repositories/`
- Implement repositories in `infrastructure/repositories/`
- Create one use case per business workflow
- Use DTOs for all external communication
- Validate input in the `interfaces/` layer
- Enforce business rules in the `domain/` layer

### DON'T ❌

- Import infrastructure code into domain or application
- Put business logic in controllers or routes
- Use ORM annotations in domain entities
- Let use cases depend on other use cases
- Return domain entities directly from API routes
- Access `process.env` outside infrastructure layer
- Use `any` type anywhere in the codebase

## 🔒 Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ledger_db
NODE_ENV=development
PORT=3000
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - feel free to use this boilerplate for your projects.

## 🤝 Contributing

Contributions are welcome! Please ensure all changes maintain the clean architecture principles:

1. Respect layer boundaries
2. Keep domain layer pure
3. Add tests for new features
4. Follow existing code style
5. Update documentation

---

Built with ❤️ following Clean Architecture principles
