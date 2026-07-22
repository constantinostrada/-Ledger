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

  equals(other: BudgetPeriod): boolean {
    return this.year === other.year && this.month === other.month;
  }

  toString(): string {
    return this.getValue();
  }
}
