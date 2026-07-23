import { User } from '@domain/entities/User';
import { Category } from '@domain/entities/Category';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { defaultCategorySeeds } from '@domain/services/defaultCategories';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { AuthResultDTO } from '../dtos/AuthResultDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(dto: RegisterUserDTO): Promise<AuthResultDTO> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email is already registered');
    }

    const user = User.create({
      id: this.idGenerator.generate(),
      email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      name: dto.name ?? null,
      baseCurrency: dto.baseCurrency,
    });

    await this.userRepository.save(user);

    // Every new user starts with the default category set.
    const defaults = defaultCategorySeeds().map((seed) =>
      Category.create({
        id: this.idGenerator.generate(),
        userId: user.id,
        name: seed.name,
        kind: seed.kind,
        color: seed.color,
      })
    );
    await this.categoryRepository.saveAll(defaults);

    return {
      token: this.tokenService.sign({ userId: user.id }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        baseCurrency: user.baseCurrency,
      },
    };
  }
}
