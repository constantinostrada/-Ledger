import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { NetWorthReportDTO } from '../dtos/NetWorthReportDTO';

export class GetNetWorthReportUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<NetWorthReportDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Archived accounts still hold funds, so they count toward net worth
    // even though the default account list hides them.
    const accounts = await this.accountRepository.findByUserId(userId, {
      includeArchived: true,
    });

    return {
      baseCurrency: user.baseCurrency,
      netWorthCents: accounts.reduce(
        (sum, account) => sum + account.balanceBase.getCents(),
        0
      ),
      accounts: accounts.map((account) => ({
        accountId: account.id,
        name: account.name,
        type: account.type.getValue(),
        currency: account.balance.getCurrency(),
        balanceCents: account.balance.getCents(),
        balanceBaseCents: account.balanceBase.getCents(),
        isActive: account.isActive,
      })),
    };
  }
}
