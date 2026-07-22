import { Budget } from '@domain/entities/Budget';
import { Money } from '@domain/value-objects/Money';
import { BudgetDTO } from '../dtos/BudgetDTO';

export function toBudgetDTO(budget: Budget, spent: Money): BudgetDTO {
  return {
    id: budget.id,
    categoryId: budget.categoryId,
    period: budget.period.getValue(),
    limitCents: budget.limit.getCents(),
    spentCents: spent.getCents(),
    remainingCents: budget.remaining(spent).getCents(),
    percentUsed: budget.percentUsed(spent),
    overBudget: budget.isOverBudget(spent),
    currency: budget.limit.getCurrency(),
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}
