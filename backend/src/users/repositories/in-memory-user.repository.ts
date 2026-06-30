/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'crypto';
import { hashSync } from 'bcryptjs';
import { type PixTipo, type User } from '../../domain/users/user.entity';
import {
  type CreateUserData,
  type UpdateUserData,
  type UserRepository,
} from './user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  constructor() {
    this.seed();
  }

  async getById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const needle = email.trim().toLowerCase();
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === needle,
    );
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      pixChave: data.pixChave,
      pixTipo: data.pixTipo,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, data: UpdateUserData): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: User = {
      ...existing,
      name: data.name?.trim() ?? existing.name,
      pixChave: data.pixChave !== undefined ? data.pixChave : existing.pixChave,
      pixTipo:
        data.pixTipo !== undefined
          ? (data.pixTipo as PixTipo)
          : existing.pixTipo,
    };

    this.users.set(id, updated);
    return updated;
  }

  private seed(): void {
    const now = new Date();
    const seededUsers: User[] = [
      {
        id: randomUUID(),
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: hashSync('changeme', 10),
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: 'Maria Silva',
        email: 'maria@example.com',
        passwordHash: hashSync('guess123', 10),
        pixChave: '11111111111',
        pixTipo: 'CPF',
        createdAt: now,
      },
    ];

    seededUsers.forEach((user) => this.users.set(user.id, user));
  }
}
