'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthResultDTO } from '@application/dtos/AuthResultDTO';
import type { RegisterUserDTO } from '@application/dtos/RegisterUserDTO';
import type { LoginUserDTO } from '@application/dtos/LoginUserDTO';
import { ApiClient } from './apiClient';

export type AuthUser = AuthResultDTO['user'];

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  /** API client that attaches the current session's Bearer token. */
  api: ApiClient;
  login(data: LoginUserDTO): Promise<void>;
  register(data: RegisterUserDTO): Promise<void>;
  logout(): void;
}

const STORAGE_KEY = 'ledger.session';

interface StoredSession {
  token: string;
  user: AuthUser;
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return parsed.token && parsed.user ? parsed : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  // 'loading' until the stored session is read, so guards don't redirect
  // before hydration has a chance to restore an existing login.
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const stored = readStoredSession();
    setSession(stored);
    setStatus(stored ? 'authenticated' : 'unauthenticated');
  }, []);

  const persist = useCallback((next: StoredSession | null) => {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setSession(next);
    setStatus(next ? 'authenticated' : 'unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const api = new ApiClient(() => session?.token ?? null);
    return {
      status,
      user: session?.user ?? null,
      api,
      async login(data) {
        const result = await api.login(data);
        persist({ token: result.token, user: result.user });
      },
      async register(data) {
        const result = await api.register(data);
        persist({ token: result.token, user: result.user });
      },
      logout() {
        persist(null);
      },
    };
  }, [session, status, persist]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
