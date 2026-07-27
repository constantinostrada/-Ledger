import type { RegisterUserDTO } from '@application/dtos/RegisterUserDTO';
import type { LoginUserDTO } from '@application/dtos/LoginUserDTO';
import type { AuthResultDTO } from '@application/dtos/AuthResultDTO';
import type { AccountDTO } from '@application/dtos/AccountDTO';
import type { CreateAccountDTO } from '@application/dtos/CreateAccountDTO';
import type { NetWorthReportDTO } from '@application/dtos/NetWorthReportDTO';
import type { CategoryDTO } from '@application/dtos/CategoryDTO';
import type { TransactionDTO } from '@application/dtos/TransactionDTO';
import type { CreateTransactionDTO } from '@application/dtos/CreateTransactionDTO';
import type { UpdateTransactionDTO } from '@application/dtos/UpdateTransactionDTO';
import type { GetTransactionsDTO } from '@application/dtos/GetTransactionsDTO';
import type { BudgetDTO } from '@application/dtos/BudgetDTO';
import type { SetBudgetDTO } from '@application/dtos/SetBudgetDTO';
import type { GetSpendByCategoryReportDTO } from '@application/dtos/GetSpendByCategoryReportDTO';
import type { SpendByCategoryReportDTO } from '@application/dtos/SpendByCategoryReportDTO';
import type { GetIncomeVsExpenseReportDTO } from '@application/dtos/GetIncomeVsExpenseReportDTO';
import type { IncomeVsExpenseReportDTO } from '@application/dtos/IncomeVsExpenseReportDTO';

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

  createAccount(data: CreateAccountDTO): Promise<AccountDTO> {
    return this.request('POST', '/api/accounts', data);
  }

  // Archive is a soft delete: the account keeps its transaction history
  // and disappears from the default list.
  archiveAccount(accountId: string): Promise<AccountDTO> {
    return this.request('DELETE', `/api/accounts/${accountId}`);
  }

  getNetWorthReport(): Promise<NetWorthReportDTO> {
    return this.request('GET', '/api/reports/net-worth');
  }

  getCategories(): Promise<CategoryDTO[]> {
    return this.request('GET', '/api/categories');
  }

  getTransactions(filters: GetTransactionsDTO = {}): Promise<TransactionDTO[]> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }
    const qs = query.toString();
    return this.request(
      'GET',
      qs ? `/api/transactions?${qs}` : '/api/transactions'
    );
  }

  createTransaction(data: CreateTransactionDTO): Promise<TransactionDTO> {
    return this.request('POST', '/api/transactions', data);
  }

  updateTransaction(
    transactionId: string,
    data: UpdateTransactionDTO
  ): Promise<TransactionDTO> {
    return this.request('PATCH', `/api/transactions/${transactionId}`, data);
  }

  // A hard delete: balances are derived from the ledger, so the account
  // balance and every report adjust immediately.
  deleteTransaction(transactionId: string): Promise<void> {
    return this.request('DELETE', `/api/transactions/${transactionId}`);
  }

  getBudgets(period: string): Promise<BudgetDTO[]> {
    const query = new URLSearchParams({ period });
    return this.request('GET', `/api/budgets?${query.toString()}`);
  }

  // Setting a budget is an idempotent upsert (one limit per category +
  // month), hence PUT rather than POST.
  setBudget(data: SetBudgetDTO): Promise<BudgetDTO> {
    return this.request('PUT', '/api/budgets', data);
  }

  getSpendByCategoryReport(
    params: GetSpendByCategoryReportDTO
  ): Promise<SpendByCategoryReportDTO> {
    const query = new URLSearchParams({ period: params.period });
    return this.request('GET', `/api/reports/spend-by-category?${query}`);
  }

  getIncomeVsExpenseReport(
    params: GetIncomeVsExpenseReportDTO
  ): Promise<IncomeVsExpenseReportDTO> {
    const query = new URLSearchParams({ from: params.from, to: params.to });
    return this.request('GET', `/api/reports/income-vs-expense?${query}`);
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

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}
