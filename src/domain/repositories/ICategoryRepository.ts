import { Category } from '../entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByUserAndName(userId: string, name: string): Promise<Category | null>;
  findAllByUser(userId: string): Promise<Category[]>;
  save(category: Category): Promise<void>;
  saveAll(categories: Category[]): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  /**
   * Whether any transaction, recurring rule or budget still references the
   * category — deletion is blocked while it is in use.
   */
  isInUse(id: string): Promise<boolean>;
}
