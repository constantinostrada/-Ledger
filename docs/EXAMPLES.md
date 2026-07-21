# Usage Examples

This document provides practical examples of using the Ledger API.

## Prerequisites

1. Start the application:
   ```bash
   npm run docker:up
   npm run prisma:migrate
   npm run dev
   ```

2. Application will be available at `http://localhost:3000`

## Example 1: Creating an Account and Adding Transactions

### Step 1: Create a Checking Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "name": "Personal Checking",
    "type": "CHECKING",
    "initialBalance": 5000.00,
    "currency": "USD"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-001",
  "name": "Personal Checking",
  "type": "CHECKING",
  "balance": 5000,
  "currency": "USD",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

Save the `id` value - you'll need it for transactions.

### Step 2: Add a Credit Transaction (Deposit)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 1500.00,
    "currency": "USD",
    "type": "CREDIT",
    "description": "Monthly salary deposit",
    "date": "2024-01-15T09:00:00.000Z"
  }'
```

**Response:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "accountId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 1500,
  "currency": "USD",
  "type": "CREDIT",
  "description": "Monthly salary deposit",
  "date": "2024-01-15T09:00:00.000Z",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Step 3: Add a Debit Transaction (Withdrawal)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 75.50,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Grocery shopping at Whole Foods",
    "date": "2024-01-15T14:30:00.000Z"
  }'
```

### Step 4: View Transaction History

```bash
curl "http://localhost:3000/api/transactions?accountId=550e8400-e29b-41d4-a716-446655440000&limit=10"
```

**Response:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 75.5,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Grocery shopping at Whole Foods",
    "date": "2024-01-15T14:30:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 1500,
    "currency": "USD",
    "type": "CREDIT",
    "description": "Monthly salary deposit",
    "date": "2024-01-15T09:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

## Example 2: Managing Multiple Accounts

### Create a Savings Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "name": "Emergency Fund",
    "type": "SAVINGS",
    "initialBalance": 10000.00,
    "currency": "USD"
  }'
```

### Create a Credit Card Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "name": "Visa Card",
    "type": "CREDIT",
    "initialBalance": 0,
    "currency": "USD"
  }'
```

### View All User Accounts

```bash
curl "http://localhost:3000/api/accounts?userId=user-001"
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-001",
    "name": "Personal Checking",
    "type": "CHECKING",
    "balance": 6424.5,
    "currency": "USD",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "userId": "user-001",
    "name": "Emergency Fund",
    "type": "SAVINGS",
    "balance": 10000,
    "currency": "USD",
    "isActive": true,
    "createdAt": "2024-01-15T10:05:00.000Z",
    "updatedAt": "2024-01-15T10:05:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "userId": "user-001",
    "name": "Visa Card",
    "type": "CREDIT",
    "balance": 0,
    "currency": "USD",
    "isActive": true,
    "createdAt": "2024-01-15T10:06:00.000Z",
    "updatedAt": "2024-01-15T10:06:00.000Z"
  }
]
```

## Example 3: Common Transaction Scenarios

### Scenario: Monthly Recurring Bills

```bash
# Electric bill
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 120.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Electric bill - January 2024",
    "date": "2024-01-15T08:00:00.000Z"
  }'

# Internet bill
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 79.99,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Internet service - January 2024",
    "date": "2024-01-15T08:00:00.000Z"
  }'

# Rent payment
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 1500.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Rent payment - January 2024",
    "date": "2024-01-01T10:00:00.000Z"
  }'
```

### Scenario: Savings Transfer

```bash
# Debit from checking
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 500.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Transfer to savings account",
    "date": "2024-01-15T15:00:00.000Z"
  }'

# Credit to savings
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440003",
    "amount": 500.00,
    "currency": "USD",
    "type": "CREDIT",
    "description": "Transfer from checking account",
    "date": "2024-01-15T15:00:00.000Z"
  }'
```

## Example 4: Pagination

### Get First Page

```bash
curl "http://localhost:3000/api/transactions?accountId=550e8400-e29b-41d4-a716-446655440000&limit=5&offset=0"
```

### Get Second Page

```bash
curl "http://localhost:3000/api/transactions?accountId=550e8400-e29b-41d4-a716-446655440000&limit=5&offset=5"
```

### Get Third Page

```bash
curl "http://localhost:3000/api/transactions?accountId=550e8400-e29b-41d4-a716-446655440000&limit=5&offset=10"
```

## Example 5: Health Check

### Check Application Status

```bash
curl http://localhost:3000/api/health
```

**Response (Healthy):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Example 6: Error Handling

### Invalid Transaction (Insufficient Funds)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 999999.00,
    "currency": "USD",
    "type": "DEBIT",
    "description": "Attempting to overdraw",
    "date": "2024-01-15T10:00:00.000Z"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "Failed to create transaction: Insufficient funds for debit transaction"
}
```

### Invalid Account Type

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "name": "Invalid Account",
    "type": "INVALID_TYPE",
    "initialBalance": 1000
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid enum value. Expected 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT', received 'INVALID_TYPE'"
}
```

### Future Transaction Date

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 100.00,
    "currency": "USD",
    "type": "CREDIT",
    "description": "Future transaction",
    "date": "2025-12-31T10:00:00.000Z"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "Failed to create transaction: Transaction date cannot be in the future"
}
```

## Example 7: Using JavaScript/TypeScript

### Node.js Example

```javascript
const fetch = require('node-fetch');

async function createAccountAndTransaction() {
  // Create account
  const accountResponse = await fetch('http://localhost:3000/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user-001',
      name: 'Test Account',
      type: 'CHECKING',
      initialBalance: 1000,
      currency: 'USD'
    })
  });
  
  const account = await accountResponse.json();
  console.log('Created account:', account);
  
  // Create transaction
  const transactionResponse = await fetch('http://localhost:3000/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId: account.id,
      amount: 50,
      currency: 'USD',
      type: 'DEBIT',
      description: 'Test transaction',
      date: new Date().toISOString()
    })
  });
  
  const transaction = await transactionResponse.json();
  console.log('Created transaction:', transaction);
}

createAccountAndTransaction();
```

### React Example

```typescript
import { useState } from 'react';

interface Account {
  id: string;
  name: string;
  balance: number;
  // ... other fields
}

function AccountList({ userId }: { userId: string }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/accounts?userId=${userId}`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={fetchAccounts}>Load Accounts</button>
      {loading && <p>Loading...</p>}
      <ul>
        {accounts.map(account => (
          <li key={account.id}>
            {account.name}: ${account.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Testing with Postman

You can import these examples into Postman:

1. Create a new collection named "Ledger API"
2. Add requests for each endpoint
3. Use environment variables for `accountId` and `userId`
4. Chain requests using test scripts to extract IDs

### Example Postman Test Script

```javascript
// Save account ID from response
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("accountId", response.id);
}
```

## Next Steps

- Explore the [API Documentation](./API.md) for detailed endpoint information
- Read the [Architecture Documentation](./ARCHITECTURE.md) to understand the codebase structure
- Check the [Contributing Guide](../CONTRIBUTING.md) to add new features
