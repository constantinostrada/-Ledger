import { CreateAccountDTO } from '@application/dtos/CreateAccountDTO';
import { UpdateAccountDTO } from '@application/dtos/UpdateAccountDTO';
import { AccountDTO } from '@application/dtos/AccountDTO';
import { Container } from '../di/container';

export class AccountController {
  private container = Container.getInstance();

  async createAccount(
    userId: string,
    data: CreateAccountDTO
  ): Promise<AccountDTO> {
    const useCase = this.container.getCreateAccountUseCase();
    return await useCase.execute(userId, data);
  }

  async getAccountsByUser(
    userId: string,
    includeArchived = false
  ): Promise<AccountDTO[]> {
    const useCase = this.container.getGetAccountsByUserUseCase();
    return await useCase.execute(userId, includeArchived);
  }

  async updateAccount(
    userId: string,
    accountId: string,
    data: UpdateAccountDTO
  ): Promise<AccountDTO> {
    const useCase = this.container.getUpdateAccountUseCase();
    return await useCase.execute(userId, accountId, data);
  }

  async archiveAccount(userId: string, accountId: string): Promise<AccountDTO> {
    const useCase = this.container.getArchiveAccountUseCase();
    return await useCase.execute(userId, accountId);
  }
}
