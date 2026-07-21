export interface CreateAccountDTO {
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  initialBalance?: number;
  currency?: string;
}
