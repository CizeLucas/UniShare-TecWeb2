export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserInput = {
  username?: string;
  email?: string;
  password?: string;
};

export type UserValidationError = {
  field: 'username' | 'email' | 'password';
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userRules = {
  validateCreate(input: CreateUserInput): UserValidationError[] {
    const errors: UserValidationError[] = [];

    if (!input.username || input.username.trim().length < 3) {
      errors.push({
        field: 'username',
        message: 'Username must be at least 3 characters.',
      });
    }

    if (!input.email || !emailRegex.test(input.email.trim())) {
      errors.push({
        field: 'email',
        message: 'Email must be a valid address.',
      });
    }

    if (!input.password || input.password.trim().length < 6) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 6 characters.',
      });
    }

    return errors;
  },

  validateUpdate(input: UpdateUserInput): UserValidationError[] {
    const errors: UserValidationError[] = [];

    if (input.username !== undefined && input.username.trim().length < 3) {
      errors.push({
        field: 'username',
        message: 'Username must be at least 3 characters.',
      });
    }

    if (input.email !== undefined && !emailRegex.test(input.email.trim())) {
      errors.push({
        field: 'email',
        message: 'Email must be a valid address.',
      });
    }

    if (input.password !== undefined && input.password.trim().length < 6) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 6 characters.',
      });
    }

    return errors;
  },
};
