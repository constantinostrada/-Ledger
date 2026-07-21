# 🚀 Ledger - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose installed
- Git (for cloning)

## Step 1: Initial Setup

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies (don't start yet)
npm install
```

## Step 2: Start Database

```bash
# Start PostgreSQL with Docker
npm run docker:up

# Wait a few seconds for PostgreSQL to be ready
# Then run migrations
npm run db:migrate
```

Expected output:
```
🗄️  Running database migrations...
  Running 001_create_accounts_table.sql...
  ✅ 001_create_accounts_table.sql completed
  Running 002_create_transactions_table.sql...
  ✅ 002_create_transactions_table.sql completed
✅ All migrations completed successfully!
```

## Step 3: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

You should see the welcome page! 🎉

## Step 4: Test the API

### Create an Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "name": "My Checking Account",
    "type": "CHECKING",
    "initialBalance": 1000.00,
    "currency": "USD"
  }'
```

**Copy the `id` from the response!** You'll need it for the next step.

### Create a Transaction

Replace `YOUR_ACCOUNT_ID` with the ID from the previous step:

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "YOUR_ACCOUNT_ID",
    "amount": 50.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Grocery shopping",
    "date": "2024-01-15T10:00:00Z"
  }'
```

### View Transactions

```bash
curl "http://localhost:3000/api/transactions?accountId=YOUR_ACCOUNT_ID"
```

## Step 5: Explore the Code

### Domain Layer (Business Logic)
```bash
src/domain/
  ├── entities/          # Account, Transaction
  ├── value-objects/     # Money, AccountType, TransactionType
  ├── repositories/      # Interface definitions
  └── services/          # TransactionService
```

### Application Layer (Use Cases)
```bash
src/application/
  ├── use-cases/         # CreateAccount, CreateTransaction, etc.
  ├── dtos/              # Data Transfer Objects
  └── ports/             # Infrastructure interfaces
```

### Infrastructure Layer (I/O)
```bash
src/infrastructure/
  ├── database/          # PostgreSQL client
  ├── repositories/      # Repository implementations
  └── id-generation/     # UUID generator
```

### Interfaces Layer (API)
```bash
src/interfaces/
  ├── controllers/       # AccountController, TransactionController
  ├── validation/        # Zod schemas
  └── di/                # Dependency injection container
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers

# Database
npm run db:migrate       # Run migrations
```

## Next Steps

1. **Read the docs:**
   - [README.md](./README.md) - Full documentation
   - [docs/API.md](./docs/API.md) - API reference
   - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture deep dive
   - [docs/EXAMPLES.md](./docs/EXAMPLES.md) - More examples

2. **Try the examples:**
   - Create multiple accounts
   - Add various transactions
   - Test pagination

3. **Explore the architecture:**
   - See how layers are separated
   - Notice how domain has zero dependencies
   - Check out the dependency injection

4. **Add new features:**
   - See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines

## Troubleshooting

### Database Connection Error

If you get a database connection error:

```bash
# Check if PostgreSQL is running
docker ps

# Restart the database
npm run docker:down
npm run docker:up

# Wait 10 seconds, then run migrations
npm run db:migrate
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Change the port in package.json
"dev": "PORT=3001 next dev"
```

### TypeScript Errors

```bash
# Clean build
rm -rf .next
npm run build
```

### Migration Errors

```bash
# Drop and recreate database
npm run docker:down
rm -rf postgres-data
npm run docker:up
npm run db:migrate
```

## Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes following clean architecture**
   - Domain changes → `src/domain/`
   - Use cases → `src/application/use-cases/`
   - Repositories → `src/infrastructure/repositories/`
   - API routes → `src/app/api/`

3. **Test your changes**
   ```bash
   npm run type-check
   npm run lint
   ```

4. **Commit and push**
   ```bash
   git commit -m "feat: add new feature"
   git push origin feature/my-feature
   ```

## Architecture Quick Reference

### ✅ DO
- Put business logic in domain entities
- Define repository interfaces in domain
- Implement repositories in infrastructure
- Create one use case per business workflow
- Return DTOs from use cases, not entities
- Validate input in interfaces layer
- Validate business rules in domain layer

### ❌ DON'T
- Import infrastructure in domain or application
- Put business logic in controllers
- Return entities from API routes
- Access database directly from use cases
- Let use cases depend on other use cases
- Use `any` type anywhere

## Environment Variables

Default `.env` values:

```bash
DATABASE_URL=postgresql://ledger_user:ledger_password@localhost:5432/ledger_db
NODE_ENV=development
PORT=3000
```

## Production Deployment

For production deployment:

```bash
# Build the Docker image
docker-compose build

# Start in production mode
docker-compose up -d

# View logs
docker-compose logs -f app
```

## Getting Help

- **Architecture questions**: See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **API questions**: See [docs/API.md](./docs/API.md)
- **Layer questions**: See [docs/LAYERS.md](./docs/LAYERS.md)
- **Examples**: See [docs/EXAMPLES.md](./docs/EXAMPLES.md)

## Health Check

Verify everything is working:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

**You're all set! Happy coding! 🎉**

For detailed information, see the full [README.md](./README.md)
