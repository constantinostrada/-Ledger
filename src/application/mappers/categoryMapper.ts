import { Category } from '@domain/entities/Category';
import { CategoryDTO } from '../dtos/CategoryDTO';

export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    kind: category.kind.getValue(),
    color: category.color,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
