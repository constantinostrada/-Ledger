import { CreateTransactionDTO } from '@application/dtos/CreateTransactionDTO';
import { TransactionDTO } from '@application/dtos/TransactionDTO';
import { GetTransactionsDTO } from '@application/dtos/GetTransactionsDTO';
import { Container } from '../di/container';

export class TransactionController {
  private container = Container.getInstance();

  async createTransaction(
    data: CreateTransactionDTO
  ): Promise<TransactionDTO> {
    try {
      const useCase = this.container.getCreateTransactionUseCase();
      return await useCase.execute(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
      }
      throw error;
    }
  }

  async getTransactions(
    params: GetTransactionsDTO
  ): Promise<TransactionDTO[]> {
    try {
      const useCase = this.container.getGetTransactionsUseCase();
      return await useCase.execute(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch transactions: ${error.message}`);
      }
      throw error;
    }
  }
}
