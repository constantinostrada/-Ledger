# API Documentation

## Overview

The Ledger API provides endpoints for managing financial accounts and transactions following RESTful principles.

Base URL (development): `http://localhost:3000/api`

## Authentication

Authentication is not included in this boilerplate. In production, you would add:
- JWT tokens
- OAuth 2.0
- API keys

All endpoints currently operate without authentication for demo purposes.

## Endpoints

### Accounts

#### Create Account

Creates a new financial account for a user.

**Endpoint:** `POST /api/accounts`

**Request Body:**
```json
{
  "userId": "string (required)",
  "name": "string (required, max 100 chars)",
  "type": "CHECKING | SAVINGS | CREDIT | INVESTMENT (required)",
  "initialBalance": "number (optional, default: 0)",
  "currency": "string (optional, default: 'USD', 3 chars)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "string",
  "name": "string",
  "type": "string",
  "balance": "number",
  "currency": "string",
  "isActive": true,
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "name": "My Checking Account",
    "type": "CHECKING",
    "initialBalance": 1000.00,
    "currency": "USD"
  }'
```

#### Get User Accounts

Retrieves all accounts for a specific user.

**Endpoint:** `GET /api/accounts?userId={userId}`

**Query Parameters:**
- `userId` (required): User identifier

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "string",
    "name": "string",
    "type": "string",
    "balance": "number",
    "currency": "string",
    "isActive": true,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
]
```

**Example:**
```bash
curl http://localhost:3000/api/accounts?userId=user-123
```

### Transactions

#### Create Transaction

Creates a new transaction for an account.

**Endpoint:** `POST /api/transactions`

**Request Body:**
```json
{
  "accountId": "string (required)",
  "amount": "number (required, positive)",
  "currency": "string (required, 3 chars)",
  "type": "DEBIT | CREDIT (required)",
  "description": "string (required, max 500 chars)",
  "date": "ISO 8601 timestamp (required)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "accountId": "string",
  "amount": "number",
  "currency": "string",
  "type": "string",
  "description": "string",
  "date": "ISO 8601 timestamp",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

**Business Rules:**
- Account must exist
- For DEBIT transactions: account must have sufficient balance
- Transaction date cannot be in the future
- Account must be active

**Example:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "account-uuid",
    "amount": 50.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Grocery shopping at Whole Foods",
    "date": "2024-01-15T10:30:00Z"
  }'
```

#### Get Account Transactions

Retrieves transactions for a specific account with pagination.

**Endpoint:** `GET /api/transactions?accountId={accountId}&limit={limit}&offset={offset}`

**Query Parameters:**
- `accountId` (required): Account identifier
- `limit` (optional): Number of records to return (max: 100, default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "accountId": "string",
    "amount": "number",
    "currency": "string",
    "type": "string",
    "description": "string",
    "date": "ISO 8601 timestamp",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
]
```

**Example:**
```bash
curl "http://localhost:3000/api/transactions?accountId=account-uuid&limit=10&offset=0"
```

### Health Check

#### Check System Health

Verifies the application and database are operational.

**Endpoint:** `GET /api/health`

**Response:** `200 OK` (healthy)
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "ISO 8601 timestamp"
}
```

**Response:** `503 Service Unavailable` (unhealthy)
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "timestamp": "ISO 8601 timestamp"
}
```

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request** - Invalid input
```json
{
  "error": "Error message describing the validation failure"
}
```

**404 Not Found** - Resource not found
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Internal server error"
}
```

## Data Types

### Account Types
- `CHECKING` - Standard checking account
- `SAVINGS` - Savings account
- `CREDIT` - Credit card account
- `INVESTMENT` - Investment account

### Transaction Types
- `DEBIT` - Money going out (decreases balance)
- `CREDIT` - Money coming in (increases balance)

### Currency Codes
ISO 4217 three-letter currency codes (e.g., USD, EUR, GBP)

## Rate Limiting

Not implemented in this boilerplate. In production, consider:
- Rate limiting by IP
- Rate limiting by user
- Request throttling

## Versioning

API versioning is not implemented. For production:
- Use URL versioning: `/api/v1/accounts`
- Or header versioning: `Accept: application/vnd.ledger.v1+json`

## CORS

CORS is configured by Next.js. Adjust in `next.config.js` for production.

## Best Practices

1. **Always validate input** before calling use cases
2. **Use DTOs** for all API responses (never return domain entities)
3. **Handle errors gracefully** with appropriate status codes
4. **Log errors** for debugging (add logging middleware)
5. **Version your API** when making breaking changes
6. **Document changes** in this file

## Future Enhancements

Potential additions:
- [ ] Authentication & Authorization
- [ ] Webhook support for transaction events
- [ ] Bulk transaction import/export
- [ ] Account balance history endpoint
- [ ] Transaction search and filtering
- [ ] Account statements generation
- [ ] Multi-currency conversion support
