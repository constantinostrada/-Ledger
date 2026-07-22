import { NextRequest, NextResponse } from 'next/server';
import { AccountController } from '@interfaces/controllers/AccountController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { createAccountSchema } from '@interfaces/validation/accountSchemas';

const controller = new AccountController();

export async function POST(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = createAccountSchema.parse(body);

    const account = await controller.createAccount(userId, validatedData);

    return NextResponse.json(account, { status: 201 });
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
    // Archived accounts are hidden unless explicitly requested.
    const includeArchived =
      request.nextUrl.searchParams.get('includeArchived') === 'true';

    const accounts = await controller.getAccountsByUser(
      userId,
      includeArchived
    );

    return NextResponse.json(accounts, { status: 200 });
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
