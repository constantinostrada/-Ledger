import { Account } from '@domain/entities/Account';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';
import { AccountDTO } from '../dtos/AccountDTO';
import { IIdGenerator } from '../ports/IIdGenerator';

export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(dto: CreateAccountDTO): Promise<AccountDTO> {
    const initialBalance = dto.initialBalance ?? 0;
    const currency = dto.currency ?? 'USD';

    const account = new Account({
      id: this.idGenerator.generate(),
      userId: dto.userId,
      name: dto.name,
      type: AccountType.fromString(dto.type),
      balance: new Money(initialBalance, currency),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.accountRepository.save(account);

    return this.toDTO(account);
  }

  private toDTO(account: Account): AccountDTO {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type.getValue(),
      balance: account.balance.getAmount(),
      currency: account.balance.getCurrency(),
      isActive: account.isActive,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
