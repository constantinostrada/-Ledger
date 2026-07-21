export enum TransactionTypeEnum {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export class TransactionType {
  private readonly value: TransactionTypeEnum;

  private constructor(value: TransactionTypeEnum) {
    this.value = value;
  }

  static debit(): TransactionType {
    return new TransactionType(TransactionTypeEnum.DEBIT);
  }

  static credit(): TransactionType {
    return new TransactionType(TransactionTypeEnum.CREDIT);
  }

  static fromString(value: string): TransactionType {
    const upperValue = value.toUpperCase();
    if (upperValue === TransactionTypeEnum.DEBIT) {
      return TransactionType.debit();
    }
    if (upperValue === TransactionTypeEnum.CREDIT) {
      return TransactionType.credit();
    }
    throw new Error(`Invalid transaction type: ${value}`);
  }

  isDebit(): boolean {
    return this.value === TransactionTypeEnum.DEBIT;
  }

  isCredit(): boolean {
    return this.value === TransactionTypeEnum.CREDIT;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TransactionType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
