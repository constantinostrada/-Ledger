export enum AccountTypeEnum {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT',
}

export class AccountType {
  private readonly value: AccountTypeEnum;

  private constructor(value: AccountTypeEnum) {
    this.value = value;
  }

  static checking(): AccountType {
    return new AccountType(AccountTypeEnum.CHECKING);
  }

  static savings(): AccountType {
    return new AccountType(AccountTypeEnum.SAVINGS);
  }

  static credit(): AccountType {
    return new AccountType(AccountTypeEnum.CREDIT);
  }

  static investment(): AccountType {
    return new AccountType(AccountTypeEnum.INVESTMENT);
  }

  static fromString(value: string): AccountType {
    const upperValue = value.toUpperCase();
    switch (upperValue) {
      case AccountTypeEnum.CHECKING:
        return AccountType.checking();
      case AccountTypeEnum.SAVINGS:
        return AccountType.savings();
      case AccountTypeEnum.CREDIT:
        return AccountType.credit();
      case AccountTypeEnum.INVESTMENT:
        return AccountType.investment();
      default:
        throw new Error(`Invalid account type: ${value}`);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: AccountType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
