import { Account } from '@domain/entities/Account';
import { Transaction } from '@domain/entities/Transaction';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { CreateAccountDTO } from '../dtos/CreateAccountDTO';
import { AccountDTO } from '../dtos/AccountDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { BaseCurrencyConverter } from '../services/BaseCurrencyConverter';
import { toAccountDTO } from '../mappers/accountMapper';

export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
    private readonly baseCurrencyConverter: BaseCurrencyConverter,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(userId: string, dto: CreateAccountDTO): Promise<AccountDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const initialBalanceCents = dto.initialBalanceCents ?? 0;
    const currency = dto.currency ?? 'USD';
    const initialBalance = Money.fromCents(initialBalanceCents, currency);
    const initialBalanceBase = await this.baseCurrencyConverter.toBase(
      initialBalance,
      user.baseCurrency
    );

    const account = Account.create({
      id: this.idGenerator.generate(),
      userId,
      name: dto.name,
      type: AccountType.fromString(dto.type),
      balance: initialBalance,
      balanceBase: initialBalanceBase,
    });

    await this.accountRepository.save(account);

    // Balance is never stored — an initial balance is materialized as an
    // opening income so the derived balance starts at the requested amount.
    if (initialBalance.isPositive()) {
      const openingTransaction = Transaction.create({
        id: this.idGenerator.generate(),
        accountId: account.id,
        categoryId: null,
        amount: initialBalance,
        baseAmount: initialBalanceBase,
        type: TransactionType.income(),
        note: 'Opening balance',
        date: new Date(),
      });
      await this.transactionRepository.save(openingTransaction);
    }

    return toAccountDTO(account);
  }
}
