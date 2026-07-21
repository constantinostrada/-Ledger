import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { Transaction } from '@domain/entities/Transaction';
import { GetTransactionsDTO } from '../dtos/GetTransactionsDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';

export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(
    userId: string,
    dto: GetTransactionsDTO
  ): Promise<TransactionDTO[]> {
    const account = await this.accountRepository.findById(dto.accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    const limit = dto.limit ?? 50;
    const offset = dto.offset ?? 0;

    const transactions =
      await this.transactionRepository.findByAccountIdWithPagination(
        dto.accountId,
        limit,
        offset
      );

    return transactions.map(this.toDTO);
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
