import { NextRequest, NextResponse } from 'next/server';
import { ReportController } from '@interfaces/controllers/ReportController';
import { authenticateRequest } from '@interfaces/auth/authenticateRequest';
import { spendByCategoryReportSchema } from '@interfaces/validation/reportSchemas';

const controller = new ReportController();

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof Error) {
    const status = error.message === 'User not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const validatedData = spendByCategoryReportSchema.parse({
      period: request.nextUrl.searchParams.get('period') ?? undefined,
    });

    const report = await controller.getSpendByCategory(userId, validatedData);

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
