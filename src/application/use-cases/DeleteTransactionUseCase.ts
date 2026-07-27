import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';

// A hard delete: balances are derived from the ledger, so removing the row
// immediately adjusts the account balance and every report.
export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, transactionId: string): Promise<void> {
    const existing = await this.transactionRepository.findById(transactionId);
    const account = existing
      ? await this.accountRepository.findById(existing.accountId)
      : null;
    // Same error for missing and foreign transactions, so responses don't
    // reveal which transaction ids exist for other users.
    if (!existing || !account || account.userId !== userId) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.delete(transactionId);
  }
}
