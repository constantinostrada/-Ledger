import { Budget } from '../entities/Budget';
import { BudgetPeriod } from '../value-objects/BudgetPeriod';

export interface IBudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByUserCategoryPeriod(
    userId: string,
    categoryId: string,
    period: BudgetPeriod
  ): Promise<Budget | null>;
  findByUserAndPeriod(userId: string, period: BudgetPeriod): Promise<Budget[]>;
  save(budget: Budget): Promise<void>;
  update(budget: Budget): Promise<void>;
  delete(id: string): Promise<void>;
}
