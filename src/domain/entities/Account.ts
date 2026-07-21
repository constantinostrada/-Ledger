import { Money } from '../value-objects/Money';
import { AccountType } from '../value-objects/AccountType';

export interface AccountProps {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  private readonly props: AccountProps;

  constructor(props: AccountProps) {
    this.validateAccount(props);
    this.props = props;
  }

  private validateAccount(props: AccountProps): void {
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

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
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
