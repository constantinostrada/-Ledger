import { prisma } from '@infrastructure/database/prisma';
import { PrismaAccountRepository } from '@infrastructure/repositories/PrismaAccountRepository';
import { PrismaTransactionRepository } from '@infrastructure/repositories/PrismaTransactionRepository';
import { PrismaCategoryRepository } from '@infrastructure/repositories/PrismaCategoryRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/PrismaUserRepository';
import { UuidGenerator } from '@infrastructure/id-generation/UuidGenerator';
import { BcryptPasswordHasher } from '@infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '@infrastructure/security/JwtTokenService';
import { ITokenService } from '@application/ports/ITokenService';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateAccountUseCase } from '@application/use-cases/CreateAccountUseCase';
import { GetAccountsByUserUseCase } from '@application/use-cases/GetAccountsByUserUseCase';
import { CreateTransactionUseCase } from '@application/use-cases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '@application/use-cases/GetTransactionsUseCase';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

/**
 * Dependency Injection Container
 * Wires up all dependencies following clean architecture principles
 */
export class Container {
  private static instance: Container;

  // Infrastructure
  private accountRepository = new PrismaAccountRepository(prisma);
  private transactionRepository = new PrismaTransactionRepository(prisma);
  private categoryRepository = new PrismaCategoryRepository(prisma);
  private userRepository = new PrismaUserRepository(prisma);
  private idGenerator = new UuidGenerator();
  private passwordHasher = new BcryptPasswordHasher();
  private tokenService: ITokenService = new JwtTokenService(requireJwtSecret());

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
    this.categoryRepository,
    this.transactionService,
    this.idGenerator
  );

  private getTransactionsUseCase = new GetTransactionsUseCase(
    this.transactionRepository,
    this.accountRepository
  );

  private registerUserUseCase = new RegisterUserUseCase(
    this.userRepository,
    this.passwordHasher,
    this.tokenService,
    this.idGenerator
  );

  private loginUserUseCase = new LoginUserUseCase(
    this.userRepository,
    this.passwordHasher,
    this.tokenService
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

  getRegisterUserUseCase(): RegisterUserUseCase {
    return this.registerUserUseCase;
  }

  getLoginUserUseCase(): LoginUserUseCase {
    return this.loginUserUseCase;
  }

  getTokenService(): ITokenService {
    return this.tokenService;
  }
}
