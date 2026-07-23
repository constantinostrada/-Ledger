import { describe, expect, it } from 'vitest';
import { Category } from '@domain/entities/Category';
import { User } from '@domain/entities/User';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { defaultCategorySeeds } from '@domain/services/defaultCategories';
import { CreateCategoryUseCase } from '@application/use-cases/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '@application/use-cases/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '@application/use-cases/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '@application/use-cases/DeleteCategoryUseCase';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { IIdGenerator } from '@application/ports/IIdGenerator';
import { IPasswordHasher } from '@application/ports/IPasswordHasher';
import { ITokenService } from '@application/ports/ITokenService';

const USER_ID = 'user-1';
const OTHER_USER_ID = 'user-2';

class FakeCategoryRepository implements ICategoryRepository {
  readonly stored: Category[] = [];
  /** Category ids the fake reports as referenced by other records. */
  readonly inUseIds = new Set<string>();

  async findById(id: string): Promise<Category | null> {
    return this.stored.find((category) => category.id === id) ?? null;
  }

  async findByUserAndName(
    userId: string,
    name: string
  ): Promise<Category | null> {
    return (
      this.stored.find(
        (category) => category.userId === userId && category.name === name
      ) ?? null
    );
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    return this.stored.filter((category) => category.userId === userId);
  }

  async save(category: Category): Promise<void> {
    this.stored.push(category);
  }

  async saveAll(categories: Category[]): Promise<void> {
    this.stored.push(...categories);
  }

  async update(_category: Category): Promise<void> {}

  async delete(id: string): Promise<void> {
    const index = this.stored.findIndex((category) => category.id === id);
    if (index >= 0) {
      this.stored.splice(index, 1);
    }
  }

  async isInUse(id: string): Promise<boolean> {
    return this.inUseIds.has(id);
  }
}

class FakeIdGenerator implements IIdGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;
    return `id-${this.counter}`;
  }
}

function makeCategory(
  repository: FakeCategoryRepository,
  overrides: { id?: string; userId?: string; name?: string } = {}
): Category {
  const category = Category.create({
    id: overrides.id ?? 'cat-1',
    userId: overrides.userId ?? USER_ID,
    name: overrides.name ?? 'Groceries',
    kind: TransactionType.expense(),
    color: '#F59E0B',
  });
  repository.stored.push(category);
  return category;
}

describe('CreateCategoryUseCase', () => {
  it('creates a category with name, kind and color', async () => {
    const repository = new FakeCategoryRepository();
    const useCase = new CreateCategoryUseCase(repository, new FakeIdGenerator());

    const dto = await useCase.execute(USER_ID, {
      name: 'Coffee',
      kind: 'EXPENSE',
      color: '#8B5CF6',
    });

    expect(dto).toMatchObject({
      name: 'Coffee',
      kind: 'EXPENSE',
      color: '#8B5CF6',
    });
    expect(repository.stored).toHaveLength(1);
    expect(repository.stored[0].userId).toBe(USER_ID);
  });

  it('rejects a duplicate name for the same user', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { name: 'Coffee' });
    const useCase = new CreateCategoryUseCase(repository, new FakeIdGenerator());

    await expect(
      useCase.execute(USER_ID, {
        name: 'Coffee',
        kind: 'EXPENSE',
        color: '#8B5CF6',
      })
    ).rejects.toThrow('Category name already exists');
  });

  it('allows the same name for different users', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { userId: OTHER_USER_ID, name: 'Coffee' });
    const useCase = new CreateCategoryUseCase(repository, new FakeIdGenerator());

    const dto = await useCase.execute(USER_ID, {
      name: 'Coffee',
      kind: 'EXPENSE',
      color: '#8B5CF6',
    });

    expect(dto.name).toBe('Coffee');
    expect(repository.stored).toHaveLength(2);
  });
});

describe('ListCategoriesUseCase', () => {
  it("returns only the requesting user's categories", async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { id: 'cat-1', name: 'Groceries' });
    makeCategory(repository, {
      id: 'cat-2',
      userId: OTHER_USER_ID,
      name: 'Rent',
    });
    const useCase = new ListCategoriesUseCase(repository);

    const categories = await useCase.execute(USER_ID);

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe('Groceries');
  });
});

describe('UpdateCategoryUseCase', () => {
  it('renames and recolors a category', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository);
    const useCase = new UpdateCategoryUseCase(repository);

    const dto = await useCase.execute(USER_ID, 'cat-1', {
      name: 'Food',
      color: '#EF4444',
    });

    expect(dto).toMatchObject({ name: 'Food', color: '#EF4444' });
  });

  it('rejects renaming to a name the user already has', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { id: 'cat-1', name: 'Groceries' });
    makeCategory(repository, { id: 'cat-2', name: 'Rent' });
    const useCase = new UpdateCategoryUseCase(repository);

    await expect(
      useCase.execute(USER_ID, 'cat-2', { name: 'Groceries' })
    ).rejects.toThrow('Category name already exists');
  });

  it('keeping the current name is not a duplicate', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { id: 'cat-1', name: 'Groceries' });
    const useCase = new UpdateCategoryUseCase(repository);

    const dto = await useCase.execute(USER_ID, 'cat-1', {
      name: 'Groceries',
      color: '#EF4444',
    });

    expect(dto.color).toBe('#EF4444');
  });

  it("reports another user's category as not found", async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { userId: OTHER_USER_ID });
    const useCase = new UpdateCategoryUseCase(repository);

    await expect(
      useCase.execute(USER_ID, 'cat-1', { name: 'Food' })
    ).rejects.toThrow('Category not found');
  });
});

describe('DeleteCategoryUseCase', () => {
  it('deletes an unused category', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository);
    const useCase = new DeleteCategoryUseCase(repository);

    await useCase.execute(USER_ID, 'cat-1');

    expect(repository.stored).toHaveLength(0);
  });

  it('blocks deleting a category that is in use', async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository);
    repository.inUseIds.add('cat-1');
    const useCase = new DeleteCategoryUseCase(repository);

    await expect(useCase.execute(USER_ID, 'cat-1')).rejects.toThrow(
      'Category is in use'
    );
    expect(repository.stored).toHaveLength(1);
  });

  it("reports another user's category as not found", async () => {
    const repository = new FakeCategoryRepository();
    makeCategory(repository, { userId: OTHER_USER_ID });
    const useCase = new DeleteCategoryUseCase(repository);

    await expect(useCase.execute(USER_ID, 'cat-1')).rejects.toThrow(
      'Category not found'
    );
  });
});

describe('RegisterUserUseCase default categories', () => {
  class FakeUserRepository implements IUserRepository {
    readonly stored: User[] = [];

    async findById(id: string): Promise<User | null> {
      return this.stored.find((user) => user.id === id) ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
      return this.stored.find((user) => user.email === email) ?? null;
    }

    async save(user: User): Promise<void> {
      this.stored.push(user);
    }

    async update(_user: User): Promise<void> {}

    async delete(id: string): Promise<void> {
      const index = this.stored.findIndex((user) => user.id === id);
      if (index >= 0) {
        this.stored.splice(index, 1);
      }
    }
  }

  const passwordHasher: IPasswordHasher = {
    hash: async (password) => `hashed:${password}`,
    compare: async () => true,
  };

  const tokenService: ITokenService = {
    sign: () => 'token',
    verify: () => ({ userId: USER_ID }),
  };

  it('seeds the default category set for the new user', async () => {
    const userRepository = new FakeUserRepository();
    const categoryRepository = new FakeCategoryRepository();
    const useCase = new RegisterUserUseCase(
      userRepository,
      categoryRepository,
      passwordHasher,
      tokenService,
      new FakeIdGenerator()
    );

    const result = await useCase.execute({
      email: 'new@ledger.dev',
      password: 'Secret123!',
    });

    const seeds = defaultCategorySeeds();
    expect(categoryRepository.stored).toHaveLength(seeds.length);
    expect(
      categoryRepository.stored.every(
        (category) => category.userId === result.user.id
      )
    ).toBe(true);
    expect(categoryRepository.stored.map((category) => category.name)).toEqual(
      seeds.map((seed) => seed.name)
    );
  });
});
