import { Money } from '../value-objects/Money';
import { TransactionType } from '../value-objects/TransactionType';

export interface TransactionProps {
  id: string;
  accountId: string;
  categoryId: string | null;
  amount: Money;
  type: TransactionType;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionProps {
  id: string;
  accountId: string;
  categoryId?: string | null;
  amount: Money;
  type: TransactionType;
  description: string;
  date: Date;
}

export class Transaction {
  private readonly props: TransactionProps;

  private constructor(props: TransactionProps) {
    Transaction.validate(props);
    this.props = props;
  }

  static create(props: CreateTransactionProps): Transaction {
    const now = new Date();
    return new Transaction({
      ...props,
      categoryId: props.categoryId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing transaction from persistence.
   */
  static reconstitute(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  private static validate(props: TransactionProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Transaction ID is required');
    }

    if (!props.accountId || props.accountId.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (props.categoryId !== null && props.categoryId.trim().length === 0) {
      throw new Error('Category ID must not be empty when provided');
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

    if (!props.amount.isPositive()) {
      throw new Error('Transaction amount must be positive');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get categoryId(): string | null {
    return this.props.categoryId;
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
