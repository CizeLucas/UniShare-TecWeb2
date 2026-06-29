import { type User } from '../../domain/users/user.entity';

export type CreateUserData = {
  username: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserData = {
  username?: string;
  email?: string;
  passwordHash?: string;
};

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  list(): Promise<User[]>;
  getById(userId: number): Promise<User | undefined>;
  getByUsername(username: string): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  create(data: CreateUserData): Promise<User>;
  update(userId: number, data: UpdateUserData): Promise<User | undefined>;
  delete(userId: number): Promise<boolean>;
}
