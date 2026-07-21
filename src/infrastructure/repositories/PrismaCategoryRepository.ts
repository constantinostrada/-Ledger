import { PrismaClient, Category as CategoryRow } from '@prisma/client';
import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const row = await this.prisma.category.findUnique({ where: { name } });
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(category: Category): Promise<void> {
    await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  }

  async update(category: Category): Promise<void> {
    await this.prisma.category.update({
      where: { id: category.id },
      data: { name: category.name, updatedAt: new Date() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  private toDomain(row: CategoryRow): Category {
    return Category.reconstitute({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
