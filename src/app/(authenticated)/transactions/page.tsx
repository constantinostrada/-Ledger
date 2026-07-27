'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AccountDTO } from '@application/dtos/AccountDTO';
import type { CategoryDTO } from '@application/dtos/CategoryDTO';
import type { TransactionDTO } from '@application/dtos/TransactionDTO';
import type { GetTransactionsDTO } from '@application/dtos/GetTransactionsDTO';
import { useAuth } from '@interfaces/web/AuthContext';
import { ApiError } from '@interfaces/web/apiClient';
import { formatMoney } from '@interfaces/web/formatMoney';
import {
  centsToAmountInput,
  parseAmountToCents,
} from '@interfaces/web/moneyInput';

const TRANSACTION_TYPES = ['EXPENSE', 'INCOME'] as const;
type TransactionTypeOption = (typeof TRANSACTION_TYPES)[number];

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionsPage() {
  const { status, api, logout } = useAuth();

  // Includes archived accounts so rows referencing them still show a name;
  // pickers below only offer the active ones.
  const [accounts, setAccounts] = useState<AccountDTO[] | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [transactions, setTransactions] = useState<TransactionDTO[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const [filterAccountId, setFilterAccountId] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<TransactionTypeOption>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayInputValue);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAuthError = useCallback(
    (err: unknown, fallback: string, report: (message: string) => void) => {
      if (err instanceof ApiError && err.status === 401) {
        // Stored token is stale/expired — drop the session so the guard
        // sends the user back to /login.
        logout();
        return;
      }
      report(err instanceof ApiError ? err.message : fallback);
    },
    [logout]
  );

  const loadPickers = useCallback(async () => {
    try {
      const [accountsResult, categoriesResult] = await Promise.all([
        api.getAccounts(true),
        api.getCategories(),
      ]);
      setAccounts(accountsResult);
      setCategories(categoriesResult);
    } catch (err) {
      handleAuthError(err, 'Failed to load accounts and categories', setError);
    }
  }, [api, handleAuthError]);

  const loadTransactions = useCallback(async () => {
    const filters: GetTransactionsDTO = {
      accountId: filterAccountId || undefined,
      categoryId: filterCategoryId || undefined,
      // Date-only filter inputs become UTC day boundaries at the edge:
      // from midnight (inclusive) to end of day (inclusive).
      dateFrom: filterFrom ? `${filterFrom}T00:00:00.000Z` : undefined,
      dateTo: filterTo ? `${filterTo}T23:59:59.999Z` : undefined,
    };
    try {
      const result = await api.getTransactions(filters);
      setTransactions(result);
      setError(null);
    } catch (err) {
      handleAuthError(err, 'Failed to load transactions', setError);
    }
  }, [
    api,
    handleAuthError,
    filterAccountId,
    filterCategoryId,
    filterFrom,
    filterTo,
  ]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void loadPickers();
  }, [status, loadPickers]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void loadTransactions();
  }, [status, loadTransactions]);

  const accountById = useMemo(
    () => new Map((accounts ?? []).map((account) => [account.id, account])),
    [accounts]
  );
  const categoryById = useMemo(
    () =>
      new Map((categories ?? []).map((category) => [category.id, category])),
    [categories]
  );

  const activeAccounts = useMemo(
    () => (accounts ?? []).filter((account) => account.isActive),
    [accounts]
  );
  // When editing a transaction on an archived account, keep that account
  // selectable so the form still round-trips.
  const editingAccount = accountId ? accountById.get(accountId) : undefined;
  const pickerAccounts =
    editingAccount && !editingAccount.isActive
      ? [...activeAccounts, editingAccount]
      : activeAccounts;

  const selectedCurrency = accountById.get(accountId)?.currency;

  function resetForm() {
    setEditingId(null);
    setCategoryId('');
    setType('EXPENSE');
    setAmount('');
    setNote('');
    setDate(todayInputValue());
    setFormError(null);
  }

  function startEdit(transaction: TransactionDTO) {
    setEditingId(transaction.id);
    setAccountId(transaction.accountId);
    setCategoryId(transaction.categoryId ?? '');
    setType(transaction.type as TransactionTypeOption);
    setAmount(centsToAmountInput(transaction.amountCents));
    setNote(transaction.note);
    setDate(transaction.date.slice(0, 10));
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // The API only accepts integer cents; the input is a decimal amount.
    const amountCents = parseAmountToCents(amount);
    if (amountCents === null) {
      setFormError(
        'Amount must be a positive number with at most two decimals'
      );
      return;
    }
    const account = accountById.get(accountId);
    if (!account) {
      setFormError('Pick an account');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await api.updateTransaction(editingId, {
          accountId,
          categoryId: categoryId === '' ? null : categoryId,
          amountCents,
          // Each account holds a single currency, so the transaction
          // currency always follows the picked account.
          currency: account.currency,
          type,
          note: note.trim(),
          date: `${date}T00:00:00.000Z`,
        });
      } else {
        await api.createTransaction({
          accountId,
          categoryId: categoryId === '' ? undefined : categoryId,
          amountCents,
          currency: account.currency,
          type,
          note: note.trim(),
          date: `${date}T00:00:00.000Z`,
        });
      }
      resetForm();
      await loadTransactions();
    } catch (err) {
      handleAuthError(
        err,
        editingId
          ? 'Failed to update transaction'
          : 'Failed to add transaction',
        setFormError
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(transactionId: string) {
    setDeletingId(transactionId);
    setError(null);
    try {
      await api.deleteTransaction(transactionId);
      if (editingId === transactionId) {
        resetForm();
      }
      await loadTransactions();
    } catch (err) {
      handleAuthError(err, 'Failed to delete transaction', setError);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h1 className="page-title">Transactions</h1>
      {error && <p className="form-error">{error}</p>}

      <h2 className="section-title">
        {editingId ? 'Edit transaction' : 'Add a transaction'}
      </h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        {formError && <p className="form-error">{formError}</p>}
        <div className="transaction-form-fields">
          <label className="form-field">
            Account
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <option value="" disabled>
                Pick an account
              </option>
              {pickerAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Uncategorized</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionTypeOption)}
            >
              {TRANSACTION_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Amount{selectedCurrency ? ` (${selectedCurrency})` : ''}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>
          <label className="form-field">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayInputValue()}
              required
            />
          </label>
          <label className="form-field">
            Note
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              required
            />
          </label>
        </div>
        <div className="transaction-form-actions">
          <button
            type="submit"
            className="button-primary"
            disabled={submitting}
          >
            {submitting
              ? 'Saving…'
              : editingId
                ? 'Save changes'
                : 'Add transaction'}
          </button>
          {editingId && (
            <button
              type="button"
              className="button-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="section-title">History</h2>
      <div className="filter-bar">
        <label className="form-field">
          Account
          <select
            value={filterAccountId}
            onChange={(e) => setFilterAccountId(e.target.value)}
          >
            <option value="">All accounts</option>
            {(accounts ?? []).map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
                {account.isActive ? '' : ' (archived)'}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Category
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          From
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </label>
        <label className="form-field">
          To
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </label>
        {(filterAccountId || filterCategoryId || filterFrom || filterTo) && (
          <button
            type="button"
            className="button-secondary button-small filter-clear"
            onClick={() => {
              setFilterAccountId('');
              setFilterCategoryId('');
              setFilterFrom('');
              setFilterTo('');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {!error && transactions === null && <p>Loading transactions…</p>}
      {transactions !== null && transactions.length === 0 && (
        <p>No transactions match. Add your first one above.</p>
      )}
      {transactions !== null && transactions.length > 0 && (
        <div className="table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Note</th>
                <th>Account</th>
                <th>Category</th>
                <th className="cell-amount">Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date.slice(0, 10)}</td>
                  <td>{transaction.note}</td>
                  <td>{accountById.get(transaction.accountId)?.name ?? '—'}</td>
                  <td>
                    {transaction.categoryId
                      ? (categoryById.get(transaction.categoryId)?.name ?? '—')
                      : 'Uncategorized'}
                  </td>
                  <td
                    className={`cell-amount ${
                      transaction.type === 'EXPENSE'
                        ? 'amount-expense'
                        : 'amount-income'
                    }`}
                  >
                    {transaction.type === 'EXPENSE' ? '−' : '+'}
                    {formatMoney(transaction.amountCents, transaction.currency)}
                  </td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="button-secondary button-small"
                      onClick={() => startEdit(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary button-small"
                      disabled={deletingId !== null}
                      onClick={() => void handleDelete(transaction.id)}
                    >
                      {deletingId === transaction.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
