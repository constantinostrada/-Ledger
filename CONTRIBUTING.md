# Contributing to Ledger

Thank you for your interest in contributing to Ledger! This document provides guidelines for maintaining the clean architecture principles of this project.

## Architecture Rules (MANDATORY)

### 1. Layer Boundaries

**Never violate these import rules:**

```
✅ interfaces → application (OK)
✅ application → domain (OK)
✅ infrastructure → domain (OK)
✅ infrastructure → application (OK)

❌ domain → anything else (FORBIDDEN)
❌ application → infrastructure (FORBIDDEN)
❌ application → interfaces (FORBIDDEN)
❌ interfaces → domain (FORBIDDEN)
❌ interfaces → infrastructure (FORBIDDEN)
```

### 2. Domain Layer Rules

The domain layer is the heart of the application and must remain pure:

- ✅ **DO**: Define entities with business logic
- ✅ **DO**: Create value objects for domain concepts
- ✅ **DO**: Define repository interfaces (contracts only)
- ✅ **DO**: Implement domain services for multi-entity logic
- ❌ **DON'T**: Import any external libraries
- ❌ **DON'T**: Access databases or APIs
- ❌ **DON'T**: Use ORM decorators
- ❌ **DON'T**: Reference application, infrastructure, or interfaces layers

### 3. Application Layer Rules

The application layer orchestrates domain logic:

- ✅ **DO**: Create one use case per business workflow
- ✅ **DO**: Use DTOs for input/output
- ✅ **DO**: Define port interfaces for external dependencies
- ✅ **DO**: Keep use cases independent of each other
- ❌ **DON'T**: Put business logic here (belongs in domain)
- ❌ **DON'T**: Import infrastructure implementations
- ❌ **DON'T**: Make use cases depend on other use cases

### 4. Infrastructure Layer Rules

The infrastructure layer implements interfaces:

- ✅ **DO**: Implement repository interfaces from domain
- ✅ **DO**: Use ORMs, SDKs, and external libraries freely
- ✅ **DO**: Map database models to domain entities
- ✅ **DO**: Handle all I/O operations
- ❌ **DON'T**: Add business logic
- ❌ **DON'T**: Expose ORM types to application layer
- ❌ **DON'T**: Import from interfaces layer

### 5. Interfaces Layer Rules

The interfaces layer handles external communication:

- ✅ **DO**: Validate input with schemas
- ✅ **DO**: Call use cases via dependency injection
- ✅ **DO**: Transform use case output for HTTP responses
- ✅ **DO**: Handle errors and return appropriate status codes
- ❌ **DON'T**: Add business logic
- ❌ **DON'T**: Call repositories directly
- ❌ **DON'T**: Import domain entities (use DTOs instead)

## Code Style

### TypeScript

- Use strict TypeScript mode
- Never use `any` type
- Prefer interfaces over types for public contracts
- Use explicit return types for public methods

### Naming Conventions

- **Entities**: PascalCase (e.g., `Account`, `Transaction`)
- **Value Objects**: PascalCase (e.g., `Money`, `TransactionType`)
- **Use Cases**: PascalCase with "UseCase" suffix (e.g., `CreateAccountUseCase`)
- **DTOs**: PascalCase with "DTO" suffix (e.g., `CreateAccountDTO`)
- **Interfaces**: PascalCase with "I" prefix (e.g., `IAccountRepository`)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### File Organization

```
✅ One class per file
✅ File name matches class name
✅ Group related files in subdirectories
✅ Export only what's needed
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the architecture rules above
   - Add appropriate tests
   - Update documentation

3. **Verify code quality**
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add transaction filtering by date range"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Adding New Features

### Adding a New Entity

1. Create entity in `src/domain/entities/`
2. Add repository interface in `src/domain/repositories/`
3. Implement repository in `src/infrastructure/repositories/`
4. Create use cases in `src/application/use-cases/`
5. Add controllers in `src/interfaces/controllers/`
6. Wire dependencies in `src/interfaces/di/container.ts`

### Adding a New Use Case

1. Create DTO(s) in `src/application/dtos/`
2. Create use case in `src/application/use-cases/`
3. Add to DI container
4. Create controller method
5. Add API route handler
6. Add validation schema

### Adding a New Value Object

1. Create in `src/domain/value-objects/`
2. Make it immutable
3. Implement equality comparison
4. Add validation in constructor

## Testing

When adding tests (recommended but not included in boilerplate):

- **Domain tests**: Pure unit tests, no mocks
- **Application tests**: Mock repositories via interfaces
- **Infrastructure tests**: Integration tests with test database
- **Interface tests**: API integration tests

## Questions?

If you're unsure where something belongs:

1. Is it a business rule? → **Domain**
2. Is it a business workflow? → **Application (use case)**
3. Is it I/O or external service? → **Infrastructure**
4. Is it HTTP handling? → **Interfaces**

When in doubt, ask in an issue before submitting a PR.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
