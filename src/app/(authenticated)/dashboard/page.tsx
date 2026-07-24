'use client';

import { useEffect, useState } from 'react';
import type { AccountDTO } from '@application/dtos/AccountDTO';
import { useAuth } from '@interfaces/web/AuthContext';
import { ApiError } from '@interfaces/web/apiClient';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    cents / 100
  );
}

export default function DashboardPage() {
  const { status, api, logout } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    api
      .getAccounts()
      .then((result) => {
        if (!cancelled) setAccounts(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          // Stored token is stale/expired — drop the session so the guard
          // sends the user back to /login.
          logout();
          return;
        }
        setError(
          err instanceof ApiError ? err.message : 'Failed to load accounts'
        );
      });
    return () => {
      cancelled = true;
    };
  }, [status, api, logout]);

  return (
    <section>
      <h1 className="page-title">Dashboard</h1>
      <h2 className="section-title">Your accounts</h2>
      {error && <p className="form-error">{error}</p>}
      {!error && accounts === null && <p>Loading accounts…</p>}
      {accounts !== null && accounts.length === 0 && (
        <p>No accounts yet. Create one via the API to see it here.</p>
      )}
      {accounts !== null && accounts.length > 0 && (
        <ul className="account-list">
          {accounts.map((account) => (
            <li key={account.id} className="account-card">
              <div className="account-card-header">
                <strong>{account.name}</strong>
                <span className="account-type">{account.type}</span>
              </div>
              <div className="account-balance">
                {formatMoney(account.balanceCents, account.currency)}
                {account.currency !== account.baseCurrency && (
                  <span className="account-balance-base">
                    {' '}
                    ≈{' '}
                    {formatMoney(
                      account.balanceBaseCents,
                      account.baseCurrency
                    )}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
