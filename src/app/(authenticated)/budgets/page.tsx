'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BudgetDTO } from '@application/dtos/BudgetDTO';
import type { CategoryDTO } from '@application/dtos/CategoryDTO';
import { useAuth } from '@interfaces/web/AuthContext';
import { ApiError } from '@interfaces/web/apiClient';
import { formatMoney } from '@interfaces/web/formatMoney';
import {
  centsToAmountInput,
  parseAmountToCents,
} from '@interfaces/web/moneyInput';

function currentMonthValue(): string {
  return new Date().toISOString().slice(0, 7);
}

export default function BudgetsPage() {
  const { status, user, api, logout } = useAuth();

  const [period, setPeriod] = useState(currentMonthValue);
  const [categories, setCategories] = useState<CategoryDTO[] | null>(null);
  const [budgets, setBudgets] = useState<BudgetDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await api.getCategories());
    } catch (err) {
      handleAuthError(err, 'Failed to load categories', setError);
    }
  }, [api, handleAuthError]);

  const loadBudgets = useCallback(async () => {
    try {
      const result = await api.getBudgets(period);
      setBudgets(result);
      setError(null);
    } catch (err) {
      handleAuthError(err, 'Failed to load budgets', setError);
    }
  }, [api, handleAuthError, period]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    void loadCategories();
  }, [status, loadCategories]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setBudgets(null);
    void loadBudgets();
  }, [status, loadBudgets]);

  const categoryById = useMemo(
    () =>
      new Map((categories ?? []).map((category) => [category.id, category])),
    [categories]
  );

  // Budget progress tracks spending, so only expense categories can carry
  // a limit — income categories would always read as 0% used.
  const expenseCategories = useMemo(
    () => (categories ?? []).filter((category) => category.kind === 'EXPENSE'),
    [categories]
  );

  function startEdit(budget: BudgetDTO) {
    setCategoryId(budget.categoryId);
    setLimit(centsToAmountInput(budget.limitCents));
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // The API only accepts integer cents; the input is a decimal amount.
    const limitCents = parseAmountToCents(limit);
    if (limitCents === null) {
      setFormError('Limit must be a positive number with at most two decimals');
      return;
    }
    if (!categoryId) {
      setFormError('Pick a category');
      return;
    }

    setSubmitting(true);
    try {
      // Spent totals aggregate base-currency snapshots across accounts,
      // so limits are set in the user's base currency.
      await api.setBudget({
        categoryId,
        period,
        limitCents,
        currency: user?.baseCurrency ?? 'USD',
      });
      setCategoryId('');
      setLimit('');
      await loadBudgets();
    } catch (err) {
      handleAuthError(err, 'Failed to set budget', setFormError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="page-title">Budgets</h1>
      {error && <p className="form-error">{error}</p>}

      <div className="filter-bar">
        <label className="form-field">
          Month
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
          />
        </label>
      </div>

      <h2 className="section-title">Set a monthly limit</h2>
      <form className="budget-form" onSubmit={handleSubmit}>
        {formError && <p className="form-error">{formError}</p>}
        <div className="budget-form-fields">
          <label className="form-field">
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Pick a category
              </option>
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            Monthly limit{user ? ` (${user.baseCurrency})` : ''}
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>
        </div>
        <button type="submit" className="button-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Set budget'}
        </button>
      </form>

      <h2 className="section-title">This month&apos;s budgets</h2>
      {!error && budgets === null && <p>Loading budgets…</p>}
      {budgets !== null && budgets.length === 0 && (
        <p>No budgets for this month yet. Set your first one above.</p>
      )}
      {budgets !== null && budgets.length > 0 && (
        <ul className="budget-list">
          {budgets.map((budget) => {
            const category = categoryById.get(budget.categoryId);
            return (
              <li
                key={budget.id}
                className={`budget-card${budget.overBudget ? ' budget-card-over' : ''}`}
              >
                <div className="budget-card-header">
                  <span className="budget-category">
                    {category && (
                      <span
                        className="budget-category-dot"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category?.name ?? '—'}
                  </span>
                  {budget.overBudget && (
                    <span className="budget-over-badge">Over budget</span>
                  )}
                </div>
                <div
                  className="budget-progress-track"
                  role="progressbar"
                  aria-valuenow={budget.percentUsed}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${category?.name ?? 'Budget'} usage`}
                >
                  <div
                    className={`budget-progress-fill${
                      budget.overBudget ? ' budget-progress-fill-over' : ''
                    }`}
                    style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                  />
                </div>
                <div className="budget-figures">
                  <span>
                    {formatMoney(budget.spentCents, budget.currency)} spent of{' '}
                    {formatMoney(budget.limitCents, budget.currency)}
                  </span>
                  <span
                    className={
                      budget.overBudget ? 'budget-remaining-over' : undefined
                    }
                  >
                    {budget.overBudget
                      ? `${formatMoney(-budget.remainingCents, budget.currency)} over`
                      : `${formatMoney(budget.remainingCents, budget.currency)} left`}
                    {' · '}
                    {budget.percentUsed}%
                  </span>
                </div>
                <div className="budget-card-actions">
                  <button
                    type="button"
                    className="button-secondary button-small"
                    onClick={() => startEdit(budget)}
                  >
                    Edit limit
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
