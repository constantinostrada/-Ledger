import {
  PrismaClient,
  Account as AccountRow,
  AccountType as PrismaAccountType,
} from '@prisma/client';
import { Account } from '@domain/entities/Account';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const rows = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(account: Account): Promise<void> {
    await this.prisma.account.create({ data: this.toRow(account) });
  }

  async update(account: Account): Promise<void> {
    const { id, ...data } = this.toRow(account);
    await this.prisma.account.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }

  private toRow(account: Account) {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type.getValue() as PrismaAccountType,
      balanceCents: account.balance.getCents(),
      currency: account.balance.getCurrency(),
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  private toDomain(row: AccountRow): Account {
    return Account.reconstitute({
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: AccountType.fromString(row.type),
      balance: Money.fromCents(row.balanceCents, row.currency),
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
