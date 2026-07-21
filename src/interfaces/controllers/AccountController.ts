import { CreateAccountDTO } from '@application/dtos/CreateAccountDTO';
import { AccountDTO } from '@application/dtos/AccountDTO';
import { Container } from '../di/container';

export class AccountController {
  private container = Container.getInstance();

  async createAccount(data: CreateAccountDTO): Promise<AccountDTO> {
    try {
      const useCase = this.container.getCreateAccountUseCase();
      return await useCase.execute(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create account: ${error.message}`);
      }
      throw error;
    }
  }

  async getAccountsByUser(userId: string): Promise<AccountDTO[]> {
    try {
      const useCase = this.container.getGetAccountsByUserUseCase();
      return await useCase.execute(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch accounts: ${error.message}`);
      }
      throw error;
    }
  }
}
