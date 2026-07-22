import { IBudgetRepository } from '@domain/repositories/IBudgetRepository';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { Money } from '@domain/value-objects/Money';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';
import { GetBudgetsDTO } from '../dtos/GetBudgetsDTO';
import { BudgetDTO } from '../dtos/BudgetDTO';
import { toBudgetDTO } from '../mappers/budgetMapper';

export class GetBudgetsUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string, dto: GetBudgetsDTO): Promise<BudgetDTO[]> {
    const period = BudgetPeriod.fromString(dto.period);

    const budgets = await this.budgetRepository.findByUserAndPeriod(
      userId,
      period
    );
    if (budgets.length === 0) {
      return [];
    }

    // One aggregate query covers every budget in the period.
    const spentByCategory =
      await this.transactionRepository.sumExpensesByCategory(
        userId,
        budgets.map((budget) => budget.categoryId),
        period.startDate(),
        period.endDateExclusive()
      );

    return budgets.map((budget) =>
      toBudgetDTO(
        budget,
        Money.fromCents(
          spentByCategory.get(budget.categoryId) ?? 0,
          budget.limit.getCurrency()
        )
      )
    );
  }
}
