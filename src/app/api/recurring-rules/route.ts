import { NextRequest, NextResponse } from 'next/server';
import { RecurringRuleController } from '@interfaces/controllers/RecurringRuleController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { createRecurringRuleSchema } from '@interfaces/validation/recurringRuleSchemas';

const controller = new RecurringRuleController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status =
      error.message === 'Account not found' ||
      error.message === 'Category not found'
        ? 404
        : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input (ownership comes from the token, not the body)
    const validatedData = createRecurringRuleSchema.parse(body);

    const rule = await controller.createRule(userId, validatedData);

    return NextResponse.json(rule, { status: 201 });
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
    const rules = await controller.listRules(userId);
    return NextResponse.json(rules, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
