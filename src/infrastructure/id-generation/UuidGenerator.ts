import { randomUUID } from 'crypto';
import { IIdGenerator } from '@application/ports/IIdGenerator';

export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
