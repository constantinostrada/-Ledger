export class BudgetPeriod {
  private readonly year: number;
  private readonly month: number;

  private constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  /**
   * A budget period is always a calendar month, formatted YYYY-MM.
   */
  static fromString(value: string): BudgetPeriod {
    const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
    if (!match) {
      throw new Error('Budget period must be a month formatted YYYY-MM');
    }
    return new BudgetPeriod(parseInt(match[1], 10), parseInt(match[2], 10));
  }

  getValue(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}`;
  }

  /** First instant of the month (UTC), inclusive. */
  startDate(): Date {
    return new Date(Date.UTC(this.year, this.month - 1, 1));
  }

  /** First instant of the next month (UTC), exclusive upper bound. */
  endDateExclusive(): Date {
    return new Date(Date.UTC(this.year, this.month, 1));
  }

  /** The calendar month immediately after this one. */
  next(): BudgetPeriod {
    return this.month === 12
      ? new BudgetPeriod(this.year + 1, 1)
      : new BudgetPeriod(this.year, this.month + 1);
  }

  /**
   * Whole months from this month to the other (0 for the same month,
   * negative when the other month is earlier).
   */
  monthsUntil(other: BudgetPeriod): number {
    return (other.year - this.year) * 12 + (other.month - this.month);
  }

  isAfter(other: BudgetPeriod): boolean {
    return other.monthsUntil(this) > 0;
  }

  equals(other: BudgetPeriod): boolean {
    return this.year === other.year && this.month === other.month;
  }

  toString(): string {
    return this.getValue();
  }
}
