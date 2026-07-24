'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AccountDTO } from '@application/dtos/AccountDTO';
import type { NetWorthReportDTO } from '@application/dtos/NetWorthReportDTO';
import { useAuth } from '@interfaces/web/AuthContext';
import { ApiError } from '@interfaces/web/apiClient';
import { formatMoney } from '@interfaces/web/formatMoney';

const ACCOUNT_TYPES = ['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT'] as const;
type AccountTypeOption = (typeof ACCOUNT_TYPES)[number];

export default function DashboardPage() {
  const { status, api, logout } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[] | null>(null);
  const [netWorth, setNetWorth] = useState<NetWorthReportDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountTypeOption>('CHECKING');
  const [openingBalance, setOpeningBalance] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [accountsResult, netWorthResult] = await Promise.all([
        api.getAccounts(),
        api.getNetWorthReport(),
      ]);
      setAccounts(accountsResult);
      setNetWorth(netWorthResult);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Stored token is stale/expired — drop the session so the guard
        // sends the user back to /login.
        logout();
        return;
      }
      setError(
        err instanceof ApiError ? err.message : 'Failed to load dashboard'
      );
    }
  }, [api, logout]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void loadData();
  }, [status, loadData]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await api.createAccount({
        name: name.trim(),
        type,
        // The API only accepts integer cents; the input is a decimal amount.
        initialBalanceCents:
          openingBalance === ''
            ? undefined
            : Math.round(Number(openingBalance) * 100),
        currency: currency.trim().toUpperCase(),
      });
      setName('');
      setType('CHECKING');
      setOpeningBalance('');
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setFormError(
        err instanceof ApiError ? err.message : 'Failed to create account'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchive(accountId: string) {
    setArchivingId(accountId);
    setError(null);
    try {
      await api.archiveAccount(accountId);
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(
        err instanceof ApiError ? err.message : 'Failed to archive account'
      );
    } finally {
      setArchivingId(null);
    }
  }

  return (
    <section>
      <h1 className="page-title">Dashboard</h1>
      {error && <p className="form-error">{error}</p>}

      <div className="net-worth-card">
        <span className="net-worth-label">Net worth</span>
        <span className="net-worth-amount">
          {netWorth === null
            ? '—'
            : formatMoney(netWorth.netWorthCents, netWorth.baseCurrency)}
        </span>
        <span className="net-worth-note">
          Across all accounts, including archived ones
        </span>
      </div>

      <h2 className="section-title">Your accounts</h2>
      {!error && accounts === null && <p>Loading accounts…</p>}
      {accounts !== null && accounts.length === 0 && (
        <p>No accounts yet. Create your first one below.</p>
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
              <div className="account-card-actions">
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={archivingId !== null}
                  onClick={() => void handleArchive(account.id)}
                >
                  {archivingId === account.id ? 'Archiving…' : 'Archive'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="section-title">Add an account</h2>
      <form className="account-form" onSubmit={handleCreate}>
        {formError && <p className="form-error">{formError}</p>}
        <div className="account-form-fields">
          <label className="form-field">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </label>
          <label className="form-field">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AccountTypeOption)}
            >
              {ACCOUNT_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Opening balance
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </label>
          <label className="form-field">
            Currency
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              minLength={3}
              maxLength={3}
              required
            />
          </label>
        </div>
        <button type="submit" className="button-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </section>
  );
}
