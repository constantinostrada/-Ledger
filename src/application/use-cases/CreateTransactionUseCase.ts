import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateTransactionDTO } from '../dtos/CreateTransactionDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { BaseCurrencyConverter } from '../services/BaseCurrencyConverter';
import { toTransactionDTO } from '../mappers/transactionMapper';

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly userRepository: IUserRepository,
    private readonly transactionService: TransactionService,
    private readonly baseCurrencyConverter: BaseCurrencyConverter,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(
    userId: string,
    dto: CreateTransactionDTO
  ): Promise<TransactionDTO> {
    const account = await this.accountRepository.findById(dto.accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
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

    // The original amount is kept verbatim; its value in the user's base
    // currency is snapshotted alongside so reports never re-convert.
    const amount = Money.fromCents(dto.amountCents, dto.currency);
    const baseAmount = await this.baseCurrencyConverter.toBase(
      amount,
      user.baseCurrency
    );

    const transaction = Transaction.create({
      id: this.idGenerator.generate(),
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount,
      baseAmount,
      type: TransactionType.fromString(dto.type),
      note: dto.note,
      date: new Date(dto.date),
    });

    // Validate transaction can be applied to account
    this.transactionService.applyTransactionToAccount(account, transaction);

    await this.transactionRepository.save(transaction);

    return toTransactionDTO(transaction);
  }
}
