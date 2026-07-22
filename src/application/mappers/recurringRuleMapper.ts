import { RecurringRule } from '@domain/entities/RecurringRule';
import { RecurringRuleDTO } from '../dtos/RecurringRuleDTO';

export function toRecurringRuleDTO(rule: RecurringRule): RecurringRuleDTO {
  return {
    id: rule.id,
    accountId: rule.accountId,
    categoryId: rule.categoryId,
    amountCents: rule.amount.getCents(),
    currency: rule.amount.getCurrency(),
    type: rule.type.getValue(),
    note: rule.note,
    interval: rule.interval.getValue(),
    startDate: rule.startDate.toISOString(),
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  };
}
