import { NextRequest } from 'next/server';
import { Container } from '../di/container';

/**
 * Extracts and verifies the Bearer token, returning the authenticated
 * userId — the ONLY source of user identity for protected routes.
 * Returns null when the token is missing or invalid.
 */
export function authenticateRequest(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice('Bearer '.length).trim();
  const payload = Container.getInstance().getTokenService().verify(token);
  return payload?.userId ?? null;
}
