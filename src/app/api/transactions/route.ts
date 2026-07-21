import { NextRequest, NextResponse } from 'next/server';
import { TransactionController } from '@interfaces/controllers/TransactionController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import {
  createTransactionSchema,
  getTransactionsSchema,
} from '@interfaces/validation/transactionSchemas';

const controller = new TransactionController();

export async function POST(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = createTransactionSchema.parse(body);

    const transaction = await controller.createTransaction(
      userId,
      validatedData
    );

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const validatedData = getTransactionsSchema.parse({
      accountId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    const transactions = await controller.getTransactions(
      userId,
      validatedData
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
