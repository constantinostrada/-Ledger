import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { POST as registerRoute } from '@/app/api/auth/register/route';
import { POST as createAccountRoute } from '@/app/api/accounts/route';

/**
 * Drives a real Next.js route handler exactly like the framework would:
 * a NextRequest in, a Response out. Nothing between the test and Postgres
 * is stubbed.
 */
// `context` is typed loosely because each dynamic route declares its own
// exact params shape; tests always pass the params the route expects.
type RouteHandler = (request: NextRequest, context: any) => Promise<Response>;

export interface CallOptions {
  method?: string;
  body?: unknown;
  token?: string;
  /** Dynamic segment values for routes like /api/accounts/[id]. */
  params?: Record<string, string>;
}

export interface CallResult {
  status: number;
  body: any;
}

const BASE_URL = 'http://localhost:3010';

export async function call(
  handler: RouteHandler,
  path: string,
  options: CallOptions = {}
): Promise<CallResult> {
  const { method = 'GET', body, token, params } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['content-type'] = 'application/json';
  }
  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const request = new NextRequest(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    // Node's fetch primitives require duplex when a request carries a body.
    duplex: 'half',
  } as ConstructorParameters<typeof NextRequest>[1]);

  const response = await handler(request, params ? { params } : undefined);

  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

export interface TestUser {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    baseCurrency: string;
  };
  email: string;
  password: string;
}

/**
 * Registers a brand-new user through the real /api/auth/register route.
 * Every test works against its own user, so suites stay independent of
 * each other and of whatever else lives in the shared dev database.
 */
export async function registerUser(
  overrides: { name?: string; baseCurrency?: string } = {}
): Promise<TestUser> {
  const email = `it-${randomUUID()}@ledger.test`;
  const password = 'integration-pass-1';

  const result = await call(registerRoute, '/api/auth/register', {
    method: 'POST',
    body: { email, password, ...overrides },
  });
  if (result.status !== 201) {
    throw new Error(`registerUser failed: ${JSON.stringify(result.body)}`);
  }

  return { token: result.body.token, user: result.body.user, email, password };
}

export async function createAccount(
  token: string,
  overrides: Partial<{
    name: string;
    type: string;
    initialBalanceCents: number;
    currency: string;
  }> = {}
): Promise<any> {
  const result = await call(createAccountRoute, '/api/accounts', {
    method: 'POST',
    token,
    body: {
      name: 'Integration Checking',
      type: 'CHECKING',
      ...overrides,
    },
  });
  if (result.status !== 201) {
    throw new Error(`createAccount failed: ${JSON.stringify(result.body)}`);
  }
  return result.body;
}

/** Midnight UTC `days` days before now — a stable recurring start date. */
export function utcMidnightDaysAgo(days: number): string {
  const now = new Date();
  const midnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return new Date(midnight - days * 24 * 60 * 60 * 1000).toISOString();
}

/** The current calendar month formatted YYYY-MM (UTC). */
export function currentPeriod(): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${now.getUTCFullYear()}-${month}`;
}
