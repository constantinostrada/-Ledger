import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
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
    private readonly transactionService: TransactionService,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    // Validate account exists
    const account = await this.accountRepository.findById(dto.accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Create transaction entity
    const transaction = new Transaction({
      id: this.idGenerator.generate(),
      accountId: dto.accountId,
      amount: new Money(dto.amount, dto.currency),
      type: TransactionType.fromString(dto.type),
      description: dto.description,
      date: new Date(dto.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Validate transaction can be applied to account
    this.transactionService.applyTransactionToAccount(account, transaction);

    // Persist transaction
    await this.transactionRepository.save(transaction);

    // Return DTO
    return this.toDTO(transaction);
  }

  private toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      amount: transaction.amount.getAmount(),
      currency: transaction.amount.getCurrency(),
      type: transaction.type.getValue(),
      description: transaction.description,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
