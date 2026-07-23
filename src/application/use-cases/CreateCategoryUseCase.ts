import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { CreateCategoryDTO } from '../dtos/CreateCategoryDTO';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { toCategoryDTO } from '../mappers/categoryMapper';

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(userId: string, dto: CreateCategoryDTO): Promise<CategoryDTO> {
    const name = dto.name.trim();

    const existing = await this.categoryRepository.findByUserAndName(
      userId,
      name
    );
    if (existing) {
      throw new Error('Category name already exists');
    }

    const category = Category.create({
      id: this.idGenerator.generate(),
      userId,
      name,
      kind: TransactionType.fromString(dto.kind),
      color: dto.color,
    });

    await this.categoryRepository.save(category);

    return toCategoryDTO(category);
  }
}
