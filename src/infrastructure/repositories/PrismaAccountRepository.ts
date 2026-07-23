import {
  PrismaClient,
  Account as AccountRow,
  AccountType as PrismaAccountType,
} from '@prisma/client';
import { Account } from '@domain/entities/Account';
import {
  IAccountRepository,
  FindByUserIdOptions,
} from '@domain/repositories/IAccountRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { id },
      include: { user: { select: { baseCurrency: true } } },
    });
    if (!row) {
      return null;
    }
    const balances = await this.deriveBalances([row.id]);
    return this.toDomain(row, balances.get(row.id));
  }

  async findByUserId(
    userId: string,
    options?: FindByUserIdOptions
  ): Promise<Account[]> {
    const rows = await this.prisma.account.findMany({
      where: {
        userId,
        ...(options?.includeArchived ? {} : { isActive: true }),
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { baseCurrency: true } } },
    });
    const balances = await this.deriveBalances(rows.map((row) => row.id));
    return rows.map((row) => this.toDomain(row, balances.get(row.id)));
  }

  async save(account: Account): Promise<void> {
    await this.prisma.account.create({ data: this.toRow(account) });
  }

  async update(account: Account): Promise<void> {
    const { id, ...data } = this.toRow(account);
    await this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }

  /**
   * Balance is never stored: it is derived here as income minus expenses
   * (mirrors TransactionService.calculateBalance), aggregated in SQL so
   * listing N accounts costs one query instead of loading every transaction.
   * Both sums come from the same rows: the original amounts (the account's
   * own currency) and their base-currency values (for cross-account
   * aggregation).
   */
  private async deriveBalances(
    accountIds: string[]
  ): Promise<Map<string, { cents: number; baseCents: number }>> {
    const balances = new Map<string, { cents: number; baseCents: number }>();
    if (accountIds.length === 0) {
      return balances;
    }

    const sums = await this.prisma.transaction.groupBy({
      by: ['accountId', 'type'],
      where: { accountId: { in: accountIds } },
      _sum: { amountCents: true, baseAmountCents: true },
    });

    for (const sum of sums) {
      const sign = sum.type === 'INCOME' ? 1 : -1;
      const current = balances.get(sum.accountId) ?? { cents: 0, baseCents: 0 };
      balances.set(sum.accountId, {
        cents: current.cents + sign * (sum._sum.amountCents ?? 0),
        baseCents: current.baseCents + sign * (sum._sum.baseAmountCents ?? 0),
      });
    }

    return balances;
  }

  private toRow(account: Account) {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type.getValue() as PrismaAccountType,
      currency: account.balance.getCurrency(),
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private toDomain(
    row: AccountRow & { user: { baseCurrency: string } },
    balance?: { cents: number; baseCents: number }
  ): Account {
    return Account.reconstitute({
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: AccountType.fromString(row.type),
      balance: Money.fromCents(balance?.cents ?? 0, row.currency),
      balanceBase: Money.fromCents(
        balance?.baseCents ?? 0,
        row.user.baseCurrency
      ),
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
