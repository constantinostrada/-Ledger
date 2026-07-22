import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { GetTransactionsDTO } from '../dtos/GetTransactionsDTO';
import { TransactionDTO } from '../dtos/TransactionDTO';
import { toTransactionDTO } from '../mappers/transactionMapper';

export class GetTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(
    userId: string,
    dto: GetTransactionsDTO
  ): Promise<TransactionDTO[]> {
    // Every filter is additionally scoped to the authenticated user by the
    // repository, but a foreign accountId still gets an explicit not-found
    // instead of silently returning an empty list.
    if (dto.accountId) {
      const account = await this.accountRepository.findById(dto.accountId);
      // Same error for missing and foreign accounts, so responses don't
      // reveal which account ids exist for other users.
      if (!account || account.userId !== userId) {
        throw new Error('Account not found');
      }
    }

    const limit = dto.limit ?? 50;
    const offset = dto.offset ?? 0;

    const transactions = await this.transactionRepository.findByFilter(
      {
        userId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
        dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
      },
      limit,
      offset
    );

    return transactions.map(toTransactionDTO);
  }
}
