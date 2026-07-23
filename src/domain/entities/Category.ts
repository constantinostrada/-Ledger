import { TransactionType } from '../value-objects/TransactionType';

export interface CategoryProps {
  id: string;
  userId: string;
  name: string;
  /**
   * Which side of the ledger the category classifies (INCOME or EXPENSE).
   * Fixed at creation: flipping it would silently change the meaning of
   * every transaction and budget already attached to the category.
   */
  kind: TransactionType;
  /** Hex color for UI display, e.g. "#22C55E". */
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryProps {
  id: string;
  userId: string;
  name: string;
  kind: TransactionType;
  color: string;
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export class Category {
  private readonly props: CategoryProps;

  private constructor(props: CategoryProps) {
    Category.validate(props);
    this.props = props;
  }

  static create(props: CreateCategoryProps): Category {
    const now = new Date();
    return new Category({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Rehydrates an existing category from persistence.
   */
  static reconstitute(props: CategoryProps): Category {
    return new Category(props);
  }

  private static validate(props: CategoryProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Category ID is required');
    }

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (props.name.length > 100) {
      throw new Error('Category name must not exceed 100 characters');
    }

    if (!HEX_COLOR_PATTERN.test(props.color)) {
      throw new Error('Category color must be a hex color like #22C55E');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get kind(): TransactionType {
    return this.props.kind;
  }

  get color(): string {
    return this.props.color;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    Category.validate({ ...this.props, name });
    this.props.name = name;
    this.touch();
  }

  changeColor(color: string): void {
    Category.validate({ ...this.props, color });
    this.props.color = color;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
