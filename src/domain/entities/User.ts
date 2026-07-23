export interface UserProps {
  id: string;
  email: string;
  /** Opaque hash produced by the application's password hasher port. */
  passwordHash: string;
  name: string | null;
  /** Currency every balance/report is aggregated in. */
  baseCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  id: string;
  email: string;
  passwordHash: string;
  name?: string | null;
  baseCurrency?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export class User {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    User.validate(props);
    this.props = props;
  }

  static create(props: CreateUserProps): User {
    const now = new Date();
    return new User({
      ...props,
      email: props.email.trim().toLowerCase(),
      name: props.name ?? null,
      baseCurrency: (props.baseCurrency ?? 'USD').toUpperCase(),
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing user from persistence.
   */
  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  private static validate(props: UserProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!props.email || !EMAIL_PATTERN.test(props.email)) {
      throw new Error('A valid email is required');
    }

    if (props.email.length > 255) {
      throw new Error('Email must not exceed 255 characters');
    }

    if (!props.passwordHash || props.passwordHash.trim().length === 0) {
      throw new Error('Password hash is required');
    }

    if (props.name !== null && props.name.trim().length === 0) {
      throw new Error('Name must not be empty when provided');
    }

    if (props.name !== null && props.name.length > 100) {
      throw new Error('Name must not exceed 100 characters');
    }

    if (!CURRENCY_PATTERN.test(props.baseCurrency)) {
      throw new Error('Base currency must be a 3-letter code');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get name(): string | null {
    return this.props.name;
  }

  get baseCurrency(): string {
    return this.props.baseCurrency;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
