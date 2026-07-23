import { PrismaClient, Category as CategoryRow } from '@prisma/client';
import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { TransactionType } from '@domain/value-objects/TransactionType';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserAndName(
    userId: string,
    name: string
  ): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({
      where: { userId_name: { userId, name } },
    });
    return row ? this.toDomain(row) : null;
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(category: Category): Promise<void> {
    await this.prisma.category.create({ data: this.toRow(category) });
  }

  async saveAll(categories: Category[]): Promise<void> {
    await this.prisma.category.createMany({
      data: categories.map((category) => this.toRow(category)),
    });
  }

  async update(category: Category): Promise<void> {
    await this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        color: category.color,
        updatedAt: category.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async isInUse(id: string): Promise<boolean> {
    const row = await this.prisma.category.findUnique({
      where: { id },
      select: {
        _count: {
          select: { transactions: true, recurringRules: true, budgets: true },
        },
      },
    });
    if (!row) {
      return false;
    }
    const { transactions, recurringRules, budgets } = row._count;
    return transactions + recurringRules + budgets > 0;
  }

  private toRow(category: Category) {
    return {
      id: category.id,
      userId: category.userId,
      name: category.name,
      kind: category.kind.getValue() as 'INCOME' | 'EXPENSE',
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private toDomain(row: CategoryRow): Category {
    return Category.reconstitute({
      id: row.id,
      userId: row.userId,
      name: row.name,
      kind: TransactionType.fromString(row.kind),
      color: row.color,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
