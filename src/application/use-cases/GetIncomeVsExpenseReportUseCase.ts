import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';
import { GetIncomeVsExpenseReportDTO } from '../dtos/GetIncomeVsExpenseReportDTO';
import {
  IncomeVsExpensePointDTO,
  IncomeVsExpenseReportDTO,
} from '../dtos/IncomeVsExpenseReportDTO';

/** Upper bound on the series length so a wild from/to range (e.g. 0001-01
 *  to 9999-12) cannot produce a hundred-thousand-point response. */
const MAX_MONTHS = 120;

export class GetIncomeVsExpenseReportUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    dto: GetIncomeVsExpenseReportDTO
  ): Promise<IncomeVsExpenseReportDTO> {
    const from = BudgetPeriod.fromString(dto.from);
    const to = BudgetPeriod.fromString(dto.to);
    if (from.isAfter(to)) {
      throw new Error('"from" month must not be after "to" month');
    }
    if (from.monthsUntil(to) + 1 > MAX_MONTHS) {
      throw new Error(`Range must not exceed ${MAX_MONTHS} months`);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // One aggregate query covers the whole series.
    const totals = await this.transactionRepository.sumByTypePerMonth(
      userId,
      from.startDate(),
      to.endDateExclusive()
    );
    const byMonth = new Map<
      string,
      { incomeCents: number; expenseCents: number }
    >();
    for (const total of totals) {
      const point = byMonth.get(total.month) ?? {
        incomeCents: 0,
        expenseCents: 0,
      };
      if (total.type === 'INCOME') {
        point.incomeCents += total.totalCents;
      } else {
        point.expenseCents += total.totalCents;
      }
      byMonth.set(total.month, point);
    }

    // Zero-fill so the series is continuous from `from` to `to` inclusive.
    const points: IncomeVsExpensePointDTO[] = [];
    for (let month = from; !month.isAfter(to); month = month.next()) {
      const totalsForMonth = byMonth.get(month.getValue()) ?? {
        incomeCents: 0,
        expenseCents: 0,
      };
      points.push({
        period: month.getValue(),
        incomeCents: totalsForMonth.incomeCents,
        expenseCents: totalsForMonth.expenseCents,
        netCents: totalsForMonth.incomeCents - totalsForMonth.expenseCents,
      });
    }

    return {
      from: from.getValue(),
      to: to.getValue(),
      baseCurrency: user.baseCurrency,
      points,
    };
  }
}
