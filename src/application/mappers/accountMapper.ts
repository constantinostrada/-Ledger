import { Account } from '@domain/entities/Account';
import { AccountDTO } from '../dtos/AccountDTO';

export function toAccountDTO(account: Account): AccountDTO {
  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    type: account.type.getValue(),
    balanceCents: account.balance.getCents(),
    currency: account.balance.getCurrency(),
    isActive: account.isActive,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}
