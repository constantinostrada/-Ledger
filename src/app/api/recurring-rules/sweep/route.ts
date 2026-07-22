import { NextRequest, NextResponse } from 'next/server';
import { RecurringRuleController } from '@interfaces/controllers/RecurringRuleController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';

const controller = new RecurringRuleController();

// Materializes every due occurrence of the caller's recurring rules.
// Idempotent: POSTing twice never double-posts a transaction.
export async function POST(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await controller.sweep(userId);
    return NextResponse.json(result, { status: 200 });
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
