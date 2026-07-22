import { NextRequest, NextResponse } from 'next/server';
import { BudgetController } from '@interfaces/controllers/BudgetController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import {
  setBudgetSchema,
  getBudgetsSchema,
} from '@interfaces/validation/budgetSchemas';

const controller = new BudgetController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status = error.message === 'Category not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

// Setting a budget is idempotent (one limit per category + month), hence PUT.
export async function PUT(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = setBudgetSchema.parse(body);

    const budget = await controller.setBudget(userId, validatedData);

    return NextResponse.json(budget, { status: 200 });
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
    const validatedData = getBudgetsSchema.parse({
      period: request.nextUrl.searchParams.get('period') ?? undefined,
    });

    const budgets = await controller.getBudgets(userId, validatedData);

    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
