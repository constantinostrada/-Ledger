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

  async execute(userId: string, dto: CreateAccountDTO): Promise<AccountDTO> {
    const initialBalanceCents = dto.initialBalanceCents ?? 0;
    const currency = dto.currency ?? 'USD';

    const account = Account.create({
      id: this.idGenerator.generate(),
      userId,
      name: dto.name,
      type: AccountType.fromString(dto.type),
      balance: Money.fromCents(initialBalanceCents, currency),
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
      balanceCents: account.balance.getCents(),
      currency: account.balance.getCurrency(),
      isActive: account.isActive,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }
}
