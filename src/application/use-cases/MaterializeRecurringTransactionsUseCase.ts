import { Transaction } from '@domain/entities/Transaction';
import { IRecurringRuleRepository } from '@domain/repositories/IRecurringRuleRepository';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { MaterializeRecurringResultDTO } from '../dtos/MaterializeRecurringResultDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { BaseCurrencyConverter } from '../services/BaseCurrencyConverter';

/**
 * The sweep: turns every due occurrence of the user's recurring rules into a
 * concrete transaction. Idempotent — each candidate carries its rule id and
 * due date, and the repository skips ones already persisted for that pair,
 * so running the sweep twice never double-posts.
 */
export class MaterializeRecurringTransactionsUseCase {
  constructor(
    private readonly recurringRuleRepository: IRecurringRuleRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
    private readonly baseCurrencyConverter: BaseCurrencyConverter,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(userId: string): Promise<MaterializeRecurringResultDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const rules = await this.recurringRuleRepository.findByUserId(userId);
    const asOf = new Date();

    const candidates: Transaction[] = [];
    for (const rule of rules) {
      // One conversion per rule: every occurrence posts the same amount.
      const baseAmount = await this.baseCurrencyConverter.toBase(
        rule.amount,
        user.baseCurrency
      );
      for (const dueDate of rule.dueDatesThrough(asOf)) {
        candidates.push(
          Transaction.create({
            id: this.idGenerator.generate(),
            accountId: rule.accountId,
            categoryId: rule.categoryId,
            recurringRuleId: rule.id,
            amount: rule.amount,
            baseAmount,
            type: rule.type,
            note: rule.note,
            date: dueDate,
          })
        );
      }
    }

    const createdCount =
      await this.transactionRepository.saveAllIgnoringDuplicates(candidates);

    return { dueCount: candidates.length, createdCount };
  }
}
