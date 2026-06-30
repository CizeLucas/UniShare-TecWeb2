import { type PixTipo } from '../../domain/users/user.entity';

export type UserPublic = {
  id: string;
  name: string;
  email: string;
  pixKey: string | null;
  pixKeyType: PixTipo | null;
  createdAt: Date;
};
