export enum RecurrenceIntervalEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class RecurrenceInterval {
  private readonly value: RecurrenceIntervalEnum;

  private constructor(value: RecurrenceIntervalEnum) {
    this.value = value;
  }

  static daily(): RecurrenceInterval {
    return new RecurrenceInterval(RecurrenceIntervalEnum.DAILY);
  }

  static weekly(): RecurrenceInterval {
    return new RecurrenceInterval(RecurrenceIntervalEnum.WEEKLY);
  }

  static monthly(): RecurrenceInterval {
    return new RecurrenceInterval(RecurrenceIntervalEnum.MONTHLY);
  }

  static fromString(value: string): RecurrenceInterval {
    const upperValue = value.toUpperCase();
    if (upperValue === RecurrenceIntervalEnum.DAILY) {
      return RecurrenceInterval.daily();
    }
    if (upperValue === RecurrenceIntervalEnum.WEEKLY) {
      return RecurrenceInterval.weekly();
    }
    if (upperValue === RecurrenceIntervalEnum.MONTHLY) {
      return RecurrenceInterval.monthly();
    }
    throw new Error(`Invalid recurrence interval: ${value}`);
  }

  /**
   * The occurrence that follows `from`, preserving `from`'s time of day.
   * Monthly recurrences keep the start date's day-of-month, clamped to the
   * target month's length (Jan 31 → Feb 28), computed in UTC.
   */
  next(from: Date, dayOfMonth: number): Date {
    switch (this.value) {
      case RecurrenceIntervalEnum.DAILY:
        return new Date(from.getTime() + 24 * 60 * 60 * 1000);
      case RecurrenceIntervalEnum.WEEKLY:
        return new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
      case RecurrenceIntervalEnum.MONTHLY: {
        const year = from.getUTCFullYear();
        const month = from.getUTCMonth() + 1;
        const daysInTargetMonth = new Date(
          Date.UTC(year, month + 1, 0)
        ).getUTCDate();
        return new Date(
          Date.UTC(
            year,
            month,
            Math.min(dayOfMonth, daysInTargetMonth),
            from.getUTCHours(),
            from.getUTCMinutes(),
            from.getUTCSeconds(),
            from.getUTCMilliseconds()
          )
        );
      }
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RecurrenceInterval): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
