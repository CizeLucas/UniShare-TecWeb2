import { type PixTipo } from '../../domain/users/user.entity';

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  pixKey?: string;
  pixKeyType?: PixTipo;
};
