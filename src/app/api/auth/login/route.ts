import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthController } from '@interfaces/controllers/AuthController';
import { loginSchema } from '@interfaces/validation/authSchemas';

const controller = new AuthController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = loginSchema.parse(body);

    const result = await controller.login(validatedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
