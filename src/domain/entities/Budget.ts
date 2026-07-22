import { Money } from '../value-objects/Money';
import { BudgetPeriod } from '../value-objects/BudgetPeriod';

export interface BudgetProps {
  id: string;
  userId: string;
  categoryId: string;
  period: BudgetPeriod;
  limit: Money;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetProps {
  id: string;
  userId: string;
  categoryId: string;
  period: BudgetPeriod;
  limit: Money;
}

export class Budget {
  private props: BudgetProps;

  private constructor(props: BudgetProps) {
    Budget.validate(props);
    this.props = props;
  }

  static create(props: CreateBudgetProps): Budget {
    const now = new Date();
    return new Budget({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing budget from persistence.
   */
  static reconstitute(props: BudgetProps): Budget {
    return new Budget(props);
  }

  private static validate(props: BudgetProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Budget ID is required');
    }

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!props.categoryId || props.categoryId.trim().length === 0) {
      throw new Error('Category ID is required');
    }

    if (!props.limit.isPositive()) {
      throw new Error('Budget limit must be positive');
    }
  }

  changeLimit(limit: Money): void {
    if (!limit.isPositive()) {
      throw new Error('Budget limit must be positive');
    }
    this.props = {
      ...this.props,
      limit,
      updatedAt: new Date(),
    };
  }

  /** Limit minus spent; negative when over budget. */
  remaining(spent: Money): Money {
    return this.props.limit.subtract(spent);
  }

  /** Whole-percent share of the limit already spent; can exceed 100. */
  percentUsed(spent: Money): number {
    return Math.round((spent.getCents() / this.props.limit.getCents()) * 100);
  }

  isOverBudget(spent: Money): boolean {
    return spent.isGreaterThan(this.props.limit);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get period(): BudgetPeriod {
    return this.props.period;
  }

  get limit(): Money {
    return this.props.limit;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
