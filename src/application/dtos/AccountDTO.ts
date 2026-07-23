export interface AccountDTO {
  id: string;
  userId: string;
  name: string;
  type: string;
  balanceCents: number;
  currency: string;
  /** The balance expressed in the user's base currency. */
  balanceBaseCents: number;
  baseCurrency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
