import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { Account } from '@domain/entities/Account';
import { AccountDTO } from '../dtos/AccountDTO';

export class GetAccountsByUserUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(userId: string): Promise<AccountDTO[]> {
    const accounts = await this.accountRepository.findByUserId(userId);
    return accounts.map(this.toDTO);
  }

  private toDTO(account: Account): AccountDTO {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type.getValue(),
      balanceCents: account.balance.getCents(),
      currency: account.balance.getCurrency(),
      isActive: account.isActive,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
