import { prisma } from '@infrastructure/database/prisma';
import { PrismaAccountRepository } from '@infrastructure/repositories/PrismaAccountRepository';
import { PrismaTransactionRepository } from '@infrastructure/repositories/PrismaTransactionRepository';
import { PrismaCategoryRepository } from '@infrastructure/repositories/PrismaCategoryRepository';
import { PrismaBudgetRepository } from '@infrastructure/repositories/PrismaBudgetRepository';
import { PrismaRecurringRuleRepository } from '@infrastructure/repositories/PrismaRecurringRuleRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/PrismaUserRepository';
import { UuidGenerator } from '@infrastructure/id-generation/UuidGenerator';
import { BcryptPasswordHasher } from '@infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '@infrastructure/security/JwtTokenService';
import { FixedExchangeRateProvider } from '@infrastructure/exchange-rates/FixedExchangeRateProvider';
import { ITokenService } from '@application/ports/ITokenService';
import { IExchangeRateProvider } from '@application/ports/IExchangeRateProvider';
import { BaseCurrencyConverter } from '@application/services/BaseCurrencyConverter';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateAccountUseCase } from '@application/use-cases/CreateAccountUseCase';
import { GetAccountsByUserUseCase } from '@application/use-cases/GetAccountsByUserUseCase';
import { UpdateAccountUseCase } from '@application/use-cases/UpdateAccountUseCase';
import { ArchiveAccountUseCase } from '@application/use-cases/ArchiveAccountUseCase';
import { CreateTransactionUseCase } from '@application/use-cases/CreateTransactionUseCase';
import { GetTransactionsUseCase } from '@application/use-cases/GetTransactionsUseCase';
import { SetBudgetUseCase } from '@application/use-cases/SetBudgetUseCase';
import { GetBudgetsUseCase } from '@application/use-cases/GetBudgetsUseCase';
import { CreateRecurringRuleUseCase } from '@application/use-cases/CreateRecurringRuleUseCase';
import { ListRecurringRulesUseCase } from '@application/use-cases/ListRecurringRulesUseCase';
import { MaterializeRecurringTransactionsUseCase } from '@application/use-cases/MaterializeRecurringTransactionsUseCase';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import { CreateCategoryUseCase } from '@application/use-cases/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '@application/use-cases/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '@application/use-cases/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '@application/use-cases/DeleteCategoryUseCase';

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
  private budgetRepository = new PrismaBudgetRepository(prisma);
  private recurringRuleRepository = new PrismaRecurringRuleRepository(prisma);
  private userRepository = new PrismaUserRepository(prisma);
  private idGenerator = new UuidGenerator();
  private passwordHasher = new BcryptPasswordHasher();
  private tokenService: ITokenService = new JwtTokenService(requireJwtSecret());
  private exchangeRateProvider: IExchangeRateProvider =
    new FixedExchangeRateProvider();

  // Domain Services
  private transactionService = new TransactionService();

  // Application Services
  private baseCurrencyConverter = new BaseCurrencyConverter(
    this.exchangeRateProvider
  );

  // Use Cases
  private createAccountUseCase = new CreateAccountUseCase(
    this.accountRepository,
    this.transactionRepository,
    this.userRepository,
    this.baseCurrencyConverter,
    this.idGenerator
  );

  private getAccountsByUserUseCase = new GetAccountsByUserUseCase(
    this.accountRepository
  );

  private updateAccountUseCase = new UpdateAccountUseCase(
    this.accountRepository
  );

  private archiveAccountUseCase = new ArchiveAccountUseCase(
    this.accountRepository
  );

  private createTransactionUseCase = new CreateTransactionUseCase(
    this.transactionRepository,
    this.accountRepository,
    this.categoryRepository,
    this.userRepository,
    this.transactionService,
    this.baseCurrencyConverter,
    this.idGenerator
  );

  private getTransactionsUseCase = new GetTransactionsUseCase(
    this.transactionRepository,
    this.accountRepository
  );

  private setBudgetUseCase = new SetBudgetUseCase(
    this.budgetRepository,
    this.categoryRepository,
    this.transactionRepository,
    this.idGenerator
  );

  private getBudgetsUseCase = new GetBudgetsUseCase(
    this.budgetRepository,
    this.transactionRepository
  );

  private createRecurringRuleUseCase = new CreateRecurringRuleUseCase(
    this.recurringRuleRepository,
    this.accountRepository,
    this.categoryRepository,
    this.idGenerator
  );

  private listRecurringRulesUseCase = new ListRecurringRulesUseCase(
    this.recurringRuleRepository
  );

  private materializeRecurringTransactionsUseCase =
    new MaterializeRecurringTransactionsUseCase(
      this.recurringRuleRepository,
      this.transactionRepository,
      this.userRepository,
      this.baseCurrencyConverter,
      this.idGenerator
    );

  private registerUserUseCase = new RegisterUserUseCase(
    this.userRepository,
    this.categoryRepository,
    this.passwordHasher,
    this.tokenService,
    this.idGenerator
  );

  private createCategoryUseCase = new CreateCategoryUseCase(
    this.categoryRepository,
    this.idGenerator
  );

  private listCategoriesUseCase = new ListCategoriesUseCase(
    this.categoryRepository
  );

  private updateCategoryUseCase = new UpdateCategoryUseCase(
    this.categoryRepository
  );

  private deleteCategoryUseCase = new DeleteCategoryUseCase(
    this.categoryRepository
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

  getUpdateAccountUseCase(): UpdateAccountUseCase {
    return this.updateAccountUseCase;
  }

  getArchiveAccountUseCase(): ArchiveAccountUseCase {
    return this.archiveAccountUseCase;
  }

  getCreateTransactionUseCase(): CreateTransactionUseCase {
    return this.createTransactionUseCase;
  }

  getGetTransactionsUseCase(): GetTransactionsUseCase {
    return this.getTransactionsUseCase;
  }

  getSetBudgetUseCase(): SetBudgetUseCase {
    return this.setBudgetUseCase;
  }

  getGetBudgetsUseCase(): GetBudgetsUseCase {
    return this.getBudgetsUseCase;
  }

  getCreateRecurringRuleUseCase(): CreateRecurringRuleUseCase {
    return this.createRecurringRuleUseCase;
  }

  getListRecurringRulesUseCase(): ListRecurringRulesUseCase {
    return this.listRecurringRulesUseCase;
  }

  getMaterializeRecurringTransactionsUseCase(): MaterializeRecurringTransactionsUseCase {
    return this.materializeRecurringTransactionsUseCase;
  }

  getCreateCategoryUseCase(): CreateCategoryUseCase {
    return this.createCategoryUseCase;
  }

  getListCategoriesUseCase(): ListCategoriesUseCase {
    return this.listCategoriesUseCase;
  }

  getUpdateCategoryUseCase(): UpdateCategoryUseCase {
    return this.updateCategoryUseCase;
  }

  getDeleteCategoryUseCase(): DeleteCategoryUseCase {
    return this.deleteCategoryUseCase;
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
