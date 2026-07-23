import { CreateCategoryDTO } from '@application/dtos/CreateCategoryDTO';
import { UpdateCategoryDTO } from '@application/dtos/UpdateCategoryDTO';
import { CategoryDTO } from '@application/dtos/CategoryDTO';
import { Container } from '../di/container';

export class CategoryController {
  private container = Container.getInstance();

  async createCategory(
    userId: string,
    data: CreateCategoryDTO
  ): Promise<CategoryDTO> {
    const useCase = this.container.getCreateCategoryUseCase();
    return await useCase.execute(userId, data);
  }

  async listCategories(userId: string): Promise<CategoryDTO[]> {
    const useCase = this.container.getListCategoriesUseCase();
    return await useCase.execute(userId);
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryDTO> {
    const useCase = this.container.getUpdateCategoryUseCase();
    return await useCase.execute(userId, categoryId, data);
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const useCase = this.container.getDeleteCategoryUseCase();
    await useCase.execute(userId, categoryId);
  }
}
