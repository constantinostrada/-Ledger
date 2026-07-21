import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { AuthResultDTO } from '../dtos/AuthResultDTO';
import { IIdGenerator } from '../ports/IIdGenerator';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
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
    });

    await this.userRepository.save(user);

    return {
      token: this.tokenService.sign({ userId: user.id }),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
