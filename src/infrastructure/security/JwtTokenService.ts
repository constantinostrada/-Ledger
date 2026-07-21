import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@application/ports/ITokenService';

const TOKEN_TTL = '1d';

export class JwtTokenService implements ITokenService {
  constructor(private readonly secret: string) {
    if (!secret || secret.trim().length === 0) {
      throw new Error('JWT secret must not be empty');
    }
  }

  sign(payload: TokenPayload): string {
    return jwt.sign({ userId: payload.userId }, this.secret, {
      expiresIn: TOKEN_TTL,
    });
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        typeof decoded.userId === 'string' &&
        decoded.userId.length > 0
      ) {
        return { userId: decoded.userId };
      }
      return null;
    } catch {
      return null;
    }
  }
}
