import { IUserRepository } from '@domain/repositories/IUserRepository';
import { LoginUserDTO } from '../dtos/LoginUserDTO';
import { AuthResultDTO } from '../dtos/AuthResultDTO';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenService } from '../ports/ITokenService';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: LoginUserDTO): Promise<AuthResultDTO> {
    const email = dto.email.trim().toLowerCase();

    // Same error for unknown email and wrong password, so responses
    // don't reveal which emails are registered.
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatches = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash
    );
    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    return {
      token: this.tokenService.sign({ userId: user.id }),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
