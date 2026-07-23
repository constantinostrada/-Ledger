import { NextRequest, NextResponse } from 'next/server';
import { CategoryController } from '@interfaces/controllers/CategoryController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { updateCategorySchema } from '@interfaces/validation/categorySchemas';

const controller = new CategoryController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    let status = 400;
    if (error.message === 'Category not found') {
      status = 404;
    } else if (
      error.message.includes('already exists') ||
      error.message.includes('in use')
    ) {
      status = 409;
    }
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
    const validatedData = updateCategorySchema.parse(body);

    const category = await controller.updateCategory(
      userId,
      params.id,
      validatedData
    );

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// DELETE is a hard delete, but only for unused categories: a category still
// referenced by transactions, recurring rules or budgets is rejected (409).
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await controller.deleteCategory(userId, params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
