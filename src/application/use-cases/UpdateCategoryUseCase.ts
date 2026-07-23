import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { UpdateCategoryDTO } from '../dtos/UpdateCategoryDTO';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { toCategoryDTO } from '../mappers/categoryMapper';

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(
    userId: string,
    categoryId: string,
    dto: UpdateCategoryDTO
  ): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(categoryId);
    // Same error for missing and foreign categories, so responses don't
    // reveal which category ids exist for other users.
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      const existing = await this.categoryRepository.findByUserAndName(
        userId,
        name
      );
      if (existing && existing.id !== category.id) {
        throw new Error('Category name already exists');
      }
      category.rename(name);
    }

    if (dto.color !== undefined) {
      category.changeColor(dto.color);
    }

    await this.categoryRepository.update(category);

    return toCategoryDTO(category);
  }
}
