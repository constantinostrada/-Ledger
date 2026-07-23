import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { toCategoryDTO } from '../mappers/categoryMapper';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(userId: string): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAllByUser(userId);
    return categories.map(toCategoryDTO);
  }
}
