export interface TokenPayload {
  userId: string;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  /** Returns the payload for a valid token, or null if invalid/expired. */
  verify(token: string): TokenPayload | null;
}
