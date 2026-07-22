import { RecurringRule } from '@domain/entities/RecurringRule';
import { IRecurringRuleRepository } from '@domain/repositories/IRecurringRuleRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { RecurrenceInterval } from '@domain/value-objects/RecurrenceInterval';
import { CreateRecurringRuleDTO } from '../dtos/CreateRecurringRuleDTO';
import { RecurringRuleDTO } from '../dtos/RecurringRuleDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { toRecurringRuleDTO } from '../mappers/recurringRuleMapper';

export class CreateRecurringRuleUseCase {
  constructor(
    private readonly recurringRuleRepository: IRecurringRuleRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(
    userId: string,
    dto: CreateRecurringRuleDTO
  ): Promise<RecurringRuleDTO> {
    const account = await this.accountRepository.findById(dto.accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const rule = RecurringRule.create({
      id: this.idGenerator.generate(),
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount: Money.fromCents(dto.amountCents, dto.currency),
      type: TransactionType.fromString(dto.type),
      note: dto.note,
      interval: RecurrenceInterval.fromString(dto.interval),
      startDate: new Date(dto.startDate),
    });

    await this.recurringRuleRepository.save(rule);

    return toRecurringRuleDTO(rule);
  }
}
