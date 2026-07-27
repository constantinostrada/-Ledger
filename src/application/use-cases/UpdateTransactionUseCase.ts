import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { TransactionService } from '@domain/services/TransactionService';
import { UpdateTransactionDTO } from '../dtos/UpdateTransactionDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { BaseCurrencyConverter } from '../services/BaseCurrencyConverter';
import { toTransactionDTO } from '../mappers/transactionMapper';

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: IUserRepository,
    private readonly transactionService: TransactionService,
    private readonly baseCurrencyConverter: BaseCurrencyConverter
  ) {}

  async execute(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDTO
  ): Promise<TransactionDTO> {
    const existing = await this.transactionRepository.findById(transactionId);
    const owningAccount = existing
      ? await this.accountRepository.findById(existing.accountId)
      : null;
    // Same error for missing and foreign transactions, so responses don't
    // reveal which transaction ids exist for other users.
    if (!existing || !owningAccount || owningAccount.userId !== userId) {
      throw new Error('Transaction not found');
    }

    const accountId = dto.accountId ?? existing.accountId;
    const account =
      accountId === existing.accountId
        ? owningAccount
        : await this.accountRepository.findById(accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    const categoryId =
      dto.categoryId === undefined ? existing.categoryId : dto.categoryId;
    if (categoryId) {
      const category = await this.categoryRepository.findById(categoryId);
      // Same error for missing and foreign categories, so responses don't
      // reveal which category ids exist for other users.
      if (!category || category.userId !== userId) {
        throw new Error('Category not found');
      }
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // The base-currency snapshot is re-taken on every edit, exactly as at
    // posting time, so aggregates keep summing consistent values.
    const amount = Money.fromCents(
      dto.amountCents ?? existing.amount.getCents(),
      dto.currency ?? existing.amount.getCurrency()
    );
    const baseAmount = await this.baseCurrencyConverter.toBase(
      amount,
      user.baseCurrency
    );

    const updated = Transaction.reconstitute({
      id: existing.id,
      accountId,
      categoryId,
      recurringRuleId: existing.recurringRuleId,
      amount,
      baseAmount,
      type: dto.type ? TransactionType.fromString(dto.type) : existing.type,
      note: dto.note ?? existing.note,
      date: dto.date ? new Date(dto.date) : existing.date,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    // Validate transaction can be applied to account
    this.transactionService.applyTransactionToAccount(account, updated);

    await this.transactionRepository.update(updated);

    return toTransactionDTO(updated);
  }
}
