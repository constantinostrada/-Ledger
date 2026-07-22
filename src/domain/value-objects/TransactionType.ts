export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class TransactionType {
  private readonly value: TransactionTypeEnum;

  private constructor(value: TransactionTypeEnum) {
    this.value = value;
  }

  static income(): TransactionType {
    return new TransactionType(TransactionTypeEnum.INCOME);
  }

  static expense(): TransactionType {
    return new TransactionType(TransactionTypeEnum.EXPENSE);
  }

  static fromString(value: string): TransactionType {
    const upperValue = value.toUpperCase();
    if (upperValue === TransactionTypeEnum.INCOME) {
      return TransactionType.income();
    }
    if (upperValue === TransactionTypeEnum.EXPENSE) {
      return TransactionType.expense();
    }
    throw new Error(`Invalid transaction type: ${value}`);
  }

  isIncome(): boolean {
    return this.value === TransactionTypeEnum.INCOME;
  }

  isExpense(): boolean {
    return this.value === TransactionTypeEnum.EXPENSE;
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
