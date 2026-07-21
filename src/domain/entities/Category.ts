export interface CategoryProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryProps {
  id: string;
  name: string;
}

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

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (props.name.length > 100) {
      throw new Error('Category name must not exceed 100 characters');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
