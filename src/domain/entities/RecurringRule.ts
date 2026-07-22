import { Money } from '../value-objects/Money';
import { TransactionType } from '../value-objects/TransactionType';
import { RecurrenceInterval } from '../value-objects/RecurrenceInterval';

export interface RecurringRuleProps {
  id: string;
  accountId: string;
  categoryId: string | null;
  amount: Money;
  type: TransactionType;
  note: string;
  interval: RecurrenceInterval;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecurringRuleProps {
  id: string;
  accountId: string;
  categoryId?: string | null;
  amount: Money;
  type: TransactionType;
  note: string;
  interval: RecurrenceInterval;
  startDate: Date;
}

export class RecurringRule {
  private readonly props: RecurringRuleProps;

  private constructor(props: RecurringRuleProps) {
    RecurringRule.validate(props);
    this.props = props;
  }

  static create(props: CreateRecurringRuleProps): RecurringRule {
    const now = new Date();
    return new RecurringRule({
      ...props,
      categoryId: props.categoryId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing recurring rule from persistence.
   */
  static reconstitute(props: RecurringRuleProps): RecurringRule {
    return new RecurringRule(props);
  }

  private static validate(props: RecurringRuleProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Recurring rule ID is required');
    }

    if (!props.accountId || props.accountId.trim().length === 0) {
      throw new Error('Account ID is required');
    }

    if (props.categoryId !== null && props.categoryId.trim().length === 0) {
      throw new Error('Category ID must not be empty when provided');
    }

    if (!props.note || props.note.trim().length === 0) {
      throw new Error('Recurring rule note is required');
    }

    if (props.note.length > 500) {
      throw new Error('Recurring rule note must not exceed 500 characters');
    }

    if (!props.amount.isPositive()) {
      throw new Error('Recurring rule amount must be positive');
    }
  }

  /**
   * Every occurrence from the start date through `asOf` (inclusive), in
   * order. The materialization sweep turns each one into a transaction.
   */
  dueDatesThrough(asOf: Date): Date[] {
    const dayOfMonth = this.props.startDate.getUTCDate();
    const dueDates: Date[] = [];
    let occurrence = this.props.startDate;
    while (occurrence.getTime() <= asOf.getTime()) {
      dueDates.push(occurrence);
      occurrence = this.props.interval.next(occurrence, dayOfMonth);
    }
    return dueDates;
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

  get note(): string {
    return this.props.note;
  }

  get interval(): RecurrenceInterval {
    return this.props.interval;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
