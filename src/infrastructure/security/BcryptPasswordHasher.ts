import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '@application/ports/IPasswordHasher';

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements IPasswordHasher {
  hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
