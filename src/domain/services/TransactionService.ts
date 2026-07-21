import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';
import { Money } from '../value-objects/Money';

export class TransactionService {
  applyTransactionToAccount(
    account: Account,
    transaction: Transaction
  ): Money {
    if (account.id !== transaction.accountId) {
      throw new Error('Transaction does not belong to this account');
    }

    let newBalance: Money;

    if (transaction.isDebit()) {
      if (!account.canDebit(transaction.amount)) {
        throw new Error('Insufficient funds for debit transaction');
      }
      newBalance = account.balance.subtract(transaction.amount);
    } else {
      if (!account.canCredit()) {
        throw new Error('Account cannot accept credits');
      }
      newBalance = account.balance.add(transaction.amount);
    }

    return newBalance;
  }

  calculateBalance(transactions: Transaction[]): Money {
    if (transactions.length === 0) {
      return new Money(0);
    }

    const currency = transactions[0].amount.getCurrency();
    let balance = new Money(0, currency);

    for (const transaction of transactions) {
      if (transaction.isCredit()) {
        balance = balance.add(transaction.amount);
      } else {
        balance = balance.subtract(transaction.amount);
      }
    }

    return balance;
  }
}
