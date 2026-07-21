import { RegisterUserDTO } from '@application/dtos/RegisterUserDTO';
import { LoginUserDTO } from '@application/dtos/LoginUserDTO';
import { AuthResultDTO } from '@application/dtos/AuthResultDTO';
import { Container } from '../di/container';

export class AuthController {
  private container = Container.getInstance();

  async register(data: RegisterUserDTO): Promise<AuthResultDTO> {
    const useCase = this.container.getRegisterUserUseCase();
    return useCase.execute(data);
  }

  async login(data: LoginUserDTO): Promise<AuthResultDTO> {
    const useCase = this.container.getLoginUserUseCase();
    return useCase.execute(data);
  }
}
