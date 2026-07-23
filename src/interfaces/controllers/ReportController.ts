import { GetSpendByCategoryReportDTO } from '@application/dtos/GetSpendByCategoryReportDTO';
import { SpendByCategoryReportDTO } from '@application/dtos/SpendByCategoryReportDTO';
import { GetIncomeVsExpenseReportDTO } from '@application/dtos/GetIncomeVsExpenseReportDTO';
import { IncomeVsExpenseReportDTO } from '@application/dtos/IncomeVsExpenseReportDTO';
import { NetWorthReportDTO } from '@application/dtos/NetWorthReportDTO';
import { Container } from '../di/container';

export class ReportController {
  private container = Container.getInstance();

  async getSpendByCategory(
    userId: string,
    params: GetSpendByCategoryReportDTO
  ): Promise<SpendByCategoryReportDTO> {
    const useCase = this.container.getGetSpendByCategoryReportUseCase();
    return await useCase.execute(userId, params);
  }

  async getIncomeVsExpense(
    userId: string,
    params: GetIncomeVsExpenseReportDTO
  ): Promise<IncomeVsExpenseReportDTO> {
    const useCase = this.container.getGetIncomeVsExpenseReportUseCase();
    return await useCase.execute(userId, params);
  }

  async getNetWorth(userId: string): Promise<NetWorthReportDTO> {
    const useCase = this.container.getGetNetWorthReportUseCase();
    return await useCase.execute(userId);
  }
}
