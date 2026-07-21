import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateTransactionDTO } from '../dtos/CreateTransactionDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { IIdGenerator } from '../ports/IIdGenerator';

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly transactionService: TransactionService,
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
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const transaction = Transaction.create({
      id: this.idGenerator.generate(),
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount: Money.fromCents(dto.amountCents, dto.currency),
      type: TransactionType.fromString(dto.type),
      description: dto.description,
      date: new Date(dto.date),
    });

    // Validate transaction can be applied to account
    this.transactionService.applyTransactionToAccount(account, transaction);

    await this.transactionRepository.save(transaction);

    return this.toDTO(transaction);
  }

  private toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      amountCents: transaction.amount.getCents(),
      currency: transaction.amount.getCurrency(),
      type: transaction.type.getValue(),
      description: transaction.description,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
