import { Transaction } from '@domain/entities/Transaction';
import { TransactionDTO } from '../dtos/TransactionDTO';

export function toTransactionDTO(transaction: Transaction): TransactionDTO {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    recurringRuleId: transaction.recurringRuleId,
    amountCents: transaction.amount.getCents(),
    currency: transaction.amount.getCurrency(),
    type: transaction.type.getValue(),
    note: transaction.note,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}
