import { TransactionType } from '../value-objects/TransactionType';

export interface DefaultCategorySeed {
  name: string;
  kind: TransactionType;
  color: string;
}

/**
 * The starter set every new user gets on registration. Users can rename,
 * recolor or delete them freely afterwards — they are plain categories,
 * not a protected system set.
 */
export function defaultCategorySeeds(): DefaultCategorySeed[] {
  return [
    { name: 'Salary', kind: TransactionType.income(), color: '#22C55E' },
    { name: 'Other Income', kind: TransactionType.income(), color: '#10B981' },
    { name: 'Groceries', kind: TransactionType.expense(), color: '#F59E0B' },
    { name: 'Rent', kind: TransactionType.expense(), color: '#3B82F6' },
    { name: 'Utilities', kind: TransactionType.expense(), color: '#06B6D4' },
    { name: 'Transport', kind: TransactionType.expense(), color: '#8B5CF6' },
    { name: 'Health', kind: TransactionType.expense(), color: '#EF4444' },
    {
      name: 'Entertainment',
      kind: TransactionType.expense(),
      color: '#EC4899',
    },
    { name: 'Other Expenses', kind: TransactionType.expense(), color: '#6B7280' },
  ];
}
