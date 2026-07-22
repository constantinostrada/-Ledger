import { PrismaClient, Budget as BudgetRow } from '@prisma/client';
import { Budget } from '@domain/entities/Budget';
import { IBudgetRepository } from '@domain/repositories/IBudgetRepository';
import { Money } from '@domain/value-objects/Money';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';

export class PrismaBudgetRepository implements IBudgetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Budget | null> {
    const row = await this.prisma.budget.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserCategoryPeriod(
    userId: string,
    categoryId: string,
    period: BudgetPeriod
  ): Promise<Budget | null> {
    const row = await this.prisma.budget.findUnique({
      where: {
        userId_categoryId_period: {
          userId,
          categoryId,
          period: period.getValue(),
        },
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserAndPeriod(
    userId: string,
    period: BudgetPeriod
  ): Promise<Budget[]> {
    const rows = await this.prisma.budget.findMany({
      where: { userId, period: period.getValue() },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(budget: Budget): Promise<void> {
    await this.prisma.budget.create({ data: this.toRow(budget) });
  }

  async update(budget: Budget): Promise<void> {
    const { id, ...data } = this.toRow(budget);
    await this.prisma.budget.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({ where: { id } });
  }

  private toRow(budget: Budget) {
    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitCents: budget.limit.getCents(),
      currency: budget.limit.getCurrency(),
      period: budget.period.getValue(),
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }

  private toDomain(row: BudgetRow): Budget {
    return Budget.reconstitute({
      id: row.id,
      userId: row.userId,
      categoryId: row.categoryId,
      period: BudgetPeriod.fromString(row.period),
      limit: Money.fromCents(row.limitCents, row.currency),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
