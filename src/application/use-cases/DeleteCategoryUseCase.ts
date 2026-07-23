import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(userId: string, categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    // Same error for missing and foreign categories, so responses don't
    // reveal which category ids exist for other users.
    if (!category || category.userId !== userId) {
      throw new Error('Category not found');
    }

    // Deleting an in-use category is blocked, never cascaded: transactions,
    // recurring rules and budgets must be detached or removed first.
    const inUse = await this.categoryRepository.isInUse(categoryId);
    if (inUse) {
      throw new Error(
        'Category is in use by transactions, recurring rules or budgets'
      );
    }

    await this.categoryRepository.delete(categoryId);
  }
}
