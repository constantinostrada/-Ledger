import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@interfaces/controllers/AuthController';
import { registerSchema } from '@interfaces/validation/authSchemas';

const controller = new AuthController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.parse(body);

    const result = await controller.register(validatedData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message.includes('already registered') ? 409 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
