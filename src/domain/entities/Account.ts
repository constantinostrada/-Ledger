import { Money } from '../value-objects/Money';
import { AccountType } from '../value-objects/AccountType';

export interface AccountProps {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  /**
   * Derived snapshot: the sum of the account's transactions at load time.
   * It is NEVER persisted — repositories must compute it from transactions.
   */
  balance: Money;
  /**
   * Derived snapshot like `balance`, but summing the transactions' values
   * converted into the user's base currency, so balances across accounts
   * holding different currencies can be aggregated.
   */
  balanceBase: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountProps {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: Money;
  balanceBase: Money;
}

export class Account {
  private readonly props: AccountProps;

  private constructor(props: AccountProps) {
    Account.validate(props);
    this.props = props;
  }

  static create(props: CreateAccountProps): Account {
    const now = new Date();
    return new Account({
      ...props,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing account from persistence.
   */
  static reconstitute(props: AccountProps): Account {
    return new Account(props);
  }

  private static validate(props: AccountProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Account name is required');
    }

    if (props.name.length > 100) {
      throw new Error('Account name must not exceed 100 characters');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): AccountType {
    return this.props.type;
  }

  get balance(): Money {
    return this.props.balance;
  }

  get balanceBase(): Money {
    return this.props.balanceBase;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    Account.validate({ ...this.props, name });
    this.props.name = name;
    this.touch();
  }

  changeType(type: AccountType): void {
    this.props.type = type;
    this.touch();
  }

  /**
   * Archiving is a soft delete: the account keeps its history but is
   * hidden from default listings and rejects new transactions.
   */
  archive(): void {
    this.props.isActive = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  canDebit(amount: Money): boolean {
    if (!this.props.isActive) {
      return false;
    }
    return this.props.balance.isGreaterThanOrEqual(amount);
  }

  canCredit(): boolean {
    return this.props.isActive;
  }
}
