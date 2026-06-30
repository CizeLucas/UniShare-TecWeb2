import { type PixTipo, type User } from '../../domain/users/user.entity';

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  pixChave?: string;
  pixTipo?: PixTipo;
};

export type UpdateUserData = {
  name?: string;
  pixChave?: string;
  pixTipo?: PixTipo;
};

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  getById(id: string): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User | undefined>;
}
