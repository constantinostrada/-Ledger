import { Account } from '../entities/Account';

export interface FindByUserIdOptions {
  /** Archived (inactive) accounts are excluded unless explicitly requested. */
  includeArchived?: boolean;
}

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string, options?: FindByUserIdOptions): Promise<Account[]>;
  save(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
  delete(id: string): Promise<void>;
}
