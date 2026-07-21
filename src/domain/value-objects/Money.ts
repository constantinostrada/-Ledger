export class Money {
  private readonly cents: number;
  private readonly currency: string;

  private constructor(cents: number, currency: string) {
    this.cents = cents;
    this.currency = currency;
  }

  /**
   * Money is ALWAYS integer cents. Fractional amounts, NaN and Infinity are rejected.
   */
  static fromCents(cents: number, currency: string = 'USD'): Money {
    if (typeof cents !== 'number' || !Number.isSafeInteger(cents)) {
      throw new Error(
        `Money must be an integer amount of cents, received: ${cents}`
      );
    }

    if (!currency || !/^[A-Za-z]{3}$/.test(currency)) {
      throw new Error('Currency must be a 3-letter code');
    }

    return new Money(cents, currency.toUpperCase());
  }

  static zero(currency: string = 'USD'): Money {
    return Money.fromCents(0, currency);
  }

  getCents(): number {
    return this.cents;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.fromCents(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.fromCents(this.cents - other.cents, this.currency);
  }

  /**
   * Scales the amount, rounding to the nearest cent.
   */
  multiply(factor: number): Money {
    if (typeof factor !== 'number' || !isFinite(factor)) {
      throw new Error('Factor must be a finite number');
    }
    return Money.fromCents(Math.round(this.cents * factor), this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.cents > other.cents;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.cents >= other.cents;
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.cents < other.cents;
  }

  isEqual(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot operate on different currencies: ${this.currency} and ${other.currency}`
      );
    }
  }

  toString(): string {
    return `${this.currency} ${(this.cents / 100).toFixed(2)}`;
  }
}
