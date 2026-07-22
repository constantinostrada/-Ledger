import { SetBudgetDTO } from '@application/dtos/SetBudgetDTO';
import { GetBudgetsDTO } from '@application/dtos/GetBudgetsDTO';
import { BudgetDTO } from '@application/dtos/BudgetDTO';
import { Container } from '../di/container';

export class BudgetController {
  private container = Container.getInstance();

  async setBudget(userId: string, data: SetBudgetDTO): Promise<BudgetDTO> {
    const useCase = this.container.getSetBudgetUseCase();
    return await useCase.execute(userId, data);
  }

  async getBudgets(
    userId: string,
    params: GetBudgetsDTO
  ): Promise<BudgetDTO[]> {
    const useCase = this.container.getGetBudgetsUseCase();
    return await useCase.execute(userId, params);
  }
}
