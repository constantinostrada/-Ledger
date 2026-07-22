import { IRecurringRuleRepository } from '@domain/repositories/IRecurringRuleRepository';
import { RecurringRuleDTO } from '../dtos/RecurringRuleDTO';
import { toRecurringRuleDTO } from '../mappers/recurringRuleMapper';

export class ListRecurringRulesUseCase {
  constructor(
    private readonly recurringRuleRepository: IRecurringRuleRepository
  ) {}

  async execute(userId: string): Promise<RecurringRuleDTO[]> {
    const rules = await this.recurringRuleRepository.findByUserId(userId);
    return rules.map(toRecurringRuleDTO);
  }
}
