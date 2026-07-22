import { CreateTransactionDTO } from '@application/dtos/CreateTransactionDTO';
import { TransactionDTO } from '@application/dtos/TransactionDTO';
import { GetTransactionsDTO } from '@application/dtos/GetTransactionsDTO';
import { Container } from '../di/container';

export class TransactionController {
  private container = Container.getInstance();

  async createTransaction(
    userId: string,
    data: CreateTransactionDTO
  ): Promise<TransactionDTO> {
    const useCase = this.container.getCreateTransactionUseCase();
    return await useCase.execute(userId, data);
  }

  async getTransactions(
    userId: string,
    params: GetTransactionsDTO
  ): Promise<TransactionDTO[]> {
    const useCase = this.container.getGetTransactionsUseCase();
    return await useCase.execute(userId, params);
  }
}
