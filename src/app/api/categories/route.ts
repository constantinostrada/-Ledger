import { NextRequest, NextResponse } from 'next/server';
import { CategoryController } from '@interfaces/controllers/CategoryController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { createCategorySchema } from '@interfaces/validation/categorySchemas';

const controller = new CategoryController();

export async function POST(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = createCategorySchema.parse(body);

    const category = await controller.createCategory(userId, validatedData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message.includes('already exists') ? 409 : 400;
      return NextResponse.json({ error: error.message }, { status });
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
    const categories = await controller.listCategories(userId);

    return NextResponse.json(categories, { status: 200 });
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
