import { Money } from '../value-objects/Money';
import { TransactionType } from '../value-objects/TransactionType';

export interface TransactionProps {
  id: string;
  accountId: string;
  amount: Money;
  type: TransactionType;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  private readonly props: TransactionProps;

  constructor(props: TransactionProps) {
    this.validateTransaction(props);
    this.props = props;
  }

  private validateTransaction(props: TransactionProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Transaction ID is required');
    }

    if (!props.accountId || props.accountId.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Transaction description is required');
    }

    if (props.description.length > 500) {
      throw new Error('Transaction description must not exceed 500 characters');
    }

    if (props.date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get description(): string {
    return this.props.description;
  }

  get date(): Date {
    return this.props.date;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isDebit(): boolean {
    return this.props.type.isDebit();
  }

  isCredit(): boolean {
    return this.props.type.isCredit();
  }
}
