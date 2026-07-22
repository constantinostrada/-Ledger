import { Budget } from '@domain/entities/Budget';
import { IBudgetRepository } from '@domain/repositories/IBudgetRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { Money } from '@domain/value-objects/Money';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';
import { SetBudgetDTO } from '../dtos/SetBudgetDTO';
import { BudgetDTO } from '../dtos/BudgetDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { toBudgetDTO } from '../mappers/budgetMapper';

export class SetBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(userId: string, dto: SetBudgetDTO): Promise<BudgetDTO> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const period = BudgetPeriod.fromString(dto.period);
    const limit = Money.fromCents(dto.limitCents, dto.currency);

    // "Set" is an upsert: one budget per (user, category, month).
    const existing = await this.budgetRepository.findByUserCategoryPeriod(
      userId,
      dto.categoryId,
      period
    );

    let budget: Budget;
    if (existing) {
      existing.changeLimit(limit);
      await this.budgetRepository.update(existing);
      budget = existing;
    } else {
      budget = Budget.create({
        id: this.idGenerator.generate(),
        userId,
        categoryId: dto.categoryId,
        period,
        limit,
      });
      await this.budgetRepository.save(budget);
    }

    const spentByCategory =
      await this.transactionRepository.sumExpensesByCategory(
        userId,
        [budget.categoryId],
        period.startDate(),
        period.endDateExclusive()
      );
    const spent = Money.fromCents(
      spentByCategory.get(budget.categoryId) ?? 0,
      budget.limit.getCurrency()
    );

    return toBudgetDTO(budget, spent);
  }
}
