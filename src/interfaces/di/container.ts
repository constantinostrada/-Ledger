import { DatabaseClient } from '@infrastructure/database/client';
import { PostgresAccountRepository } from '@infrastructure/repositories/PostgresAccountRepository';
import { PostgresTransactionRepository } from '@infrastructure/repositories/PostgresTransactionRepository';
import { UuidGenerator } from '@infrastructure/id-generation/UuidGenerator';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateAccountUseCase } from '@application/use-cases/CreateAccountUseCase';
import { GetAccountsByUserUseCase } from '@application/use-cases/GetAccountsByUserUseCase';
import { CreateTransactionUseCase } from '@application/use-cases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '@application/use-cases/GetTransactionsUseCase';

/**
 * Dependency Injection Container
 * Wires up all dependencies following clean architecture principles
 */
export class Container {
  private static instance: Container;

  // Infrastructure
  private dbClient = DatabaseClient.getInstance();
  private accountRepository = new PostgresAccountRepository(this.dbClient);
  private transactionRepository = new PostgresTransactionRepository(
    this.dbClient
  );
  private idGenerator = new UuidGenerator();

  // Domain Services
  private transactionService = new TransactionService();

  // Use Cases
  private createAccountUseCase = new CreateAccountUseCase(
    this.accountRepository,
    this.idGenerator
  );

  private getAccountsByUserUseCase = new GetAccountsByUserUseCase(
    this.accountRepository
  );

  private createTransactionUseCase = new CreateTransactionUseCase(
    this.transactionRepository,
    this.accountRepository,
    this.transactionService,
    this.idGenerator
  );

  private getTransactionsUseCase = new GetTransactionsUseCase(
    this.transactionRepository
  );

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getCreateAccountUseCase(): CreateAccountUseCase {
    return this.createAccountUseCase;
  }

  getGetAccountsByUserUseCase(): GetAccountsByUserUseCase {
    return this.getAccountsByUserUseCase;
  }

  getCreateTransactionUseCase(): CreateTransactionUseCase {
    return this.createTransactionUseCase;
  }

  getGetTransactionsUseCase(): GetTransactionsUseCase {
    return this.getTransactionsUseCase;
  }
}
