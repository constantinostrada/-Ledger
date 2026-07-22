import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { AccountDTO } from '../dtos/AccountDTO';
import { toAccountDTO } from '../mappers/accountMapper';

export class GetAccountsByUserUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    userId: string,
    includeArchived = false
  ): Promise<AccountDTO[]> {
    const accounts = await this.accountRepository.findByUserId(userId, {
      includeArchived,
    });
    return accounts.map(toAccountDTO);
  }
}
