import { RecurringRule } from '../entities/RecurringRule';

export interface IRecurringRuleRepository {
  findById(id: string): Promise<RecurringRule | null>;
  /** All rules across the accounts owned by this user. */
  findByUserId(userId: string): Promise<RecurringRule[]>;
  save(rule: RecurringRule): Promise<void>;
  delete(id: string): Promise<void>;
}
