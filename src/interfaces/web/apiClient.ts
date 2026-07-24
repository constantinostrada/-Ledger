import type { RegisterUserDTO } from '@application/dtos/RegisterUserDTO';
import type { LoginUserDTO } from '@application/dtos/LoginUserDTO';
import type { AuthResultDTO } from '@application/dtos/AuthResultDTO';
import type { AccountDTO } from '@application/dtos/AccountDTO';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type TokenProvider = () => string | null;

export class ApiClient {
  constructor(private readonly getToken: TokenProvider = () => null) {}

  register(data: RegisterUserDTO): Promise<AuthResultDTO> {
    return this.request('POST', '/api/auth/register', data);
  }

  login(data: LoginUserDTO): Promise<AuthResultDTO> {
    return this.request('POST', '/api/auth/login', data);
  }

  getAccounts(includeArchived = false): Promise<AccountDTO[]> {
    const query = includeArchived ? '?includeArchived=true' : '';
    return this.request('GET', `/api/accounts${query}`);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const payload: unknown = await response.json();
        if (
          payload !== null &&
          typeof payload === 'object' &&
          'error' in payload &&
          typeof payload.error === 'string'
        ) {
          message = payload.error;
        }
      } catch {
        // Non-JSON error body; keep the generic message.
      }
      throw new ApiError(response.status, message);
    }

    return (await response.json()) as T;
  }
}
