import { NextRequest, NextResponse } from 'next/server';
import { TransactionController } from '@interfaces/controllers/TransactionController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import {
  createTransactionSchema,
  getTransactionsSchema,
} from '@interfaces/validation/transactionSchemas';

const controller = new TransactionController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status =
      error.message === 'Account not found' ||
      error.message === 'Category not found'
        ? 404
        : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

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
    return toErrorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const validatedData = getTransactionsSchema.parse({
      accountId: searchParams.get('accountId') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    const transactions = await controller.getTransactions(
      userId,
      validatedData
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
