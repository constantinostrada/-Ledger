import { NextRequest, NextResponse } from 'next/server';
import { AccountController } from '@interfaces/controllers/AccountController';
import {
  createAccountSchema,
  getUserAccountsSchema,
} from '@interfaces/validation/accountSchemas';

const controller = new AccountController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createAccountSchema.parse(body);

    // Execute use case via controller
    const account = await controller.createAccount(validatedData);

    return NextResponse.json(account, { status: 201 });
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
    const userId = searchParams.get('userId');

    // Validate input
    const validatedData = getUserAccountsSchema.parse({ userId });

    // Execute use case via controller
    const accounts = await controller.getAccountsByUser(validatedData.userId);

    return NextResponse.json(accounts, { status: 200 });
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
