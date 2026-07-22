import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { AccountType } from '@domain/value-objects/AccountType';
import { UpdateAccountDTO } from '../dtos/UpdateAccountDTO';
import { AccountDTO } from '../dtos/AccountDTO';
import { toAccountDTO } from '../mappers/accountMapper';

export class UpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    userId: string,
    accountId: string,
    dto: UpdateAccountDTO
  ): Promise<AccountDTO> {
    const account = await this.accountRepository.findById(accountId);
    // Same error for missing and foreign accounts, so responses don't
    // reveal which account ids exist for other users.
    if (!account || account.userId !== userId) {
      throw new Error('Account not found');
    }

    if (dto.name !== undefined) {
      account.rename(dto.name);
    }

    if (dto.type !== undefined) {
      account.changeType(AccountType.fromString(dto.type));
    }

    await this.accountRepository.update(account);

    return toAccountDTO(account);
  }
}
