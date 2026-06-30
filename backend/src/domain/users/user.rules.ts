import { type PixTipo } from './user.entity';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  pixKey?: string;
  pixKeyType?: PixTipo;
};

export type UpdateUserInput = {
  name?: string;
  pixKey?: string;
  pixKeyType?: PixTipo;
};

export type UserValidationError = {
  field: 'name' | 'email' | 'password' | 'pixKey' | 'pixKeyType';
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cpfRegex = /^\d{11}$/;
const phoneRegex = /^\d{10,11}$/;

export const userRules = {
  validateCreate(input: CreateUserInput): UserValidationError[] {
    const errors: UserValidationError[] = [];

    if (!input.name || input.name.trim().length < 3) {
      errors.push({
        field: 'name',
        message: 'Name must be at least 3 characters.',
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

    if (input.pixKey !== undefined || input.pixKeyType !== undefined) {
      errors.push(...userRules.validatePixKey(input.pixKey, input.pixKeyType));
    }

    return errors;
  },

  validateUpdate(input: UpdateUserInput): UserValidationError[] {
    const errors: UserValidationError[] = [];

    if (input.name !== undefined && input.name.trim().length < 3) {
      errors.push({
        field: 'name',
        message: 'Name must be at least 3 characters.',
      });
    }

    if (input.pixKey !== undefined || input.pixKeyType !== undefined) {
      errors.push(...userRules.validatePixKey(input.pixKey, input.pixKeyType));
    }

    return errors;
  },

  validatePixKey(
    pixKey: string | undefined,
    pixKeyType: PixTipo | undefined,
  ): UserValidationError[] {
    const errors: UserValidationError[] = [];

    if (!pixKey || !pixKeyType) {
      errors.push({
        field: 'pixKey',
        message: 'Both pixKey and pixKeyType must be provided together.',
      });
      return errors;
    }

    switch (pixKeyType) {
      case 'EMAIL':
        if (!emailRegex.test(pixKey.trim())) {
          errors.push({
            field: 'pixKey',
            message: 'PIX key must be a valid email address.',
          });
        }
        break;
      case 'CPF':
        if (!cpfRegex.test(pixKey.trim())) {
          errors.push({
            field: 'pixKey',
            message: 'PIX key must be an 11-digit CPF.',
          });
        }
        break;
      case 'TELEFONE':
        if (!phoneRegex.test(pixKey.replace(/\D/g, ''))) {
          errors.push({
            field: 'pixKey',
            message:
              'PIX key must be a valid phone number with DDD (10-11 digits).',
          });
        }
        break;
      case 'ALEATORIA':
        if (pixKey.trim().length < 8) {
          errors.push({
            field: 'pixKey',
            message: 'PIX random key must be at least 8 characters.',
          });
        }
        break;
      default:
        errors.push({
          field: 'pixKeyType',
          message:
            'pixKeyType must be one of: CPF, EMAIL, TELEFONE, ALEATORIA.',
        });
    }

    return errors;
  },
};
