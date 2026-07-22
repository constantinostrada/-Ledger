import { CreateRecurringRuleDTO } from '@application/dtos/CreateRecurringRuleDTO';
import { RecurringRuleDTO } from '@application/dtos/RecurringRuleDTO';
import { MaterializeRecurringResultDTO } from '@application/dtos/MaterializeRecurringResultDTO';
import { Container } from '../di/container';

export class RecurringRuleController {
  private container = Container.getInstance();

  async createRule(
    userId: string,
    data: CreateRecurringRuleDTO
  ): Promise<RecurringRuleDTO> {
    const useCase = this.container.getCreateRecurringRuleUseCase();
    return await useCase.execute(userId, data);
  }

  async listRules(userId: string): Promise<RecurringRuleDTO[]> {
    const useCase = this.container.getListRecurringRulesUseCase();
    return await useCase.execute(userId);
  }

  async sweep(userId: string): Promise<MaterializeRecurringResultDTO> {
    const useCase = this.container.getMaterializeRecurringTransactionsUseCase();
    return await useCase.execute(userId);
  }
}
