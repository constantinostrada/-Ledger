import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';
import { GetSpendByCategoryReportDTO } from '../dtos/GetSpendByCategoryReportDTO';
import {
  SpendByCategoryItemDTO,
  SpendByCategoryReportDTO,
} from '../dtos/SpendByCategoryReportDTO';

export class GetSpendByCategoryReportUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    dto: GetSpendByCategoryReportDTO
  ): Promise<SpendByCategoryReportDTO> {
    const period = BudgetPeriod.fromString(dto.period);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // One aggregate query covers the whole month; spend is never stored.
    const spentByCategory =
      await this.transactionRepository.sumExpensesGroupedByCategory(
        userId,
        period.startDate(),
        period.endDateExclusive()
      );

    const categories = await this.categoryRepository.findAllByUser(userId);
    const nameById = new Map(
      categories.map((category) => [category.id, category.name])
    );

    const items: SpendByCategoryItemDTO[] = [...spentByCategory.entries()]
      .map(([categoryId, spentCents]) => ({
        categoryId,
        categoryName:
          categoryId === null ? null : (nameById.get(categoryId) ?? null),
        spentCents,
      }))
      .sort((a, b) => b.spentCents - a.spentCents);

    return {
      period: period.getValue(),
      baseCurrency: user.baseCurrency,
      totalSpentCents: items.reduce((sum, item) => sum + item.spentCents, 0),
      categories: items,
    };
  }
}
