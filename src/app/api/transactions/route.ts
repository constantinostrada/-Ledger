import { NextRequest, NextResponse } from 'next/server';
import { TransactionController } from '@interfaces/controllers/TransactionController';
import {
  createTransactionSchema,
  getTransactionsSchema,
} from '@interfaces/validation/transactionSchemas';

const controller = new TransactionController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createTransactionSchema.parse(body);

    // Execute use case via controller
    const transaction = await controller.createTransaction(validatedData);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Validate input
    const validatedData = getTransactionsSchema.parse({
      accountId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    // Execute use case via controller
    const transactions = await controller.getTransactions(validatedData);

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
