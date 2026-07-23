export interface RegisterUserDTO {
  email: string;
  password: string;
  name?: string;
  /** Currency all balances/reports aggregate in; defaults to USD. */
  baseCurrency?: string;
}
