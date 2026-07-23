export interface NetWorthAccountDTO {
  accountId: string;
  name: string;
  type: string;
  currency: string;
  /** Balance in the account's own currency, integer cents. */
  balanceCents: number;
  /** Balance converted to the user's base currency, integer cents. */
  balanceBaseCents: number;
  isActive: boolean;
}

export interface NetWorthReportDTO {
  baseCurrency: string;
  /** Sum of all account balances in the base currency, integer cents. */
  netWorthCents: number;
  accounts: NetWorthAccountDTO[];
}
