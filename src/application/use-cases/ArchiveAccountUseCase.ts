import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { AccountDTO } from '../dtos/AccountDTO';
import { toAccountDTO } from '../mappers/accountMapper';

export class ArchiveAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(userId: string, accountId: string): Promise<AccountDTO> {
    const account = await this.accountRepository.findById(accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    account.archive();
    await this.accountRepository.update(account);

    return toAccountDTO(account);
  }
}
