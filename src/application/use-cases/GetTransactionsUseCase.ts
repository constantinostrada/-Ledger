import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { Transaction } from '@domain/entities/Transaction';
import { GetTransactionsDTO } from '../dtos/GetTransactionsDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';

export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(dto: GetTransactionsDTO): Promise<TransactionDTO[]> {
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
