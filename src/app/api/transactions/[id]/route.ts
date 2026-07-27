import { NextRequest, NextResponse } from 'next/server';
import { TransactionController } from '@interfaces/controllers/TransactionController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { updateTransactionSchema } from '@interfaces/validation/transactionSchemas';

const controller = new TransactionController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status =
      error.message === 'Transaction not found' ||
      error.message === 'Account not found' ||
      error.message === 'Category not found'
        ? 404
        : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = updateTransactionSchema.parse(body);

    const transaction = await controller.updateTransaction(
      userId,
      params.id,
      validatedData
    );

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// DELETE is a hard delete: balances are derived from the ledger, so the
// account balance and every report adjust immediately.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await controller.deleteTransaction(userId, params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
