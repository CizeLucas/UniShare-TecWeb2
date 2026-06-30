import { type PixTipo } from '../../domain/users/user.entity';

export type UpdateUserDto = {
  name?: string;
  pixKey?: string;
  pixKeyType?: PixTipo;
};
