import { NextRequest, NextResponse } from 'next/server';
import { AccountController } from '@interfaces/controllers/AccountController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { updateAccountSchema } from '@interfaces/validation/accountSchemas';

const controller = new AccountController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status = error.message === 'Account not found' ? 404 : 400;
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
    const validatedData = updateAccountSchema.parse(body);

    const account = await controller.updateAccount(
      userId,
      params.id,
      validatedData
    );

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// DELETE archives (soft-deletes): the account keeps its transaction history
// and disappears from the default list.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const account = await controller.archiveAccount(userId, params.id);

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
