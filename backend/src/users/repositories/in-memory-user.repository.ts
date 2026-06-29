import { hashSync } from 'bcryptjs';
import { type User } from '../../domain/users/user.entity';
import {
  type CreateUserData,
  type UpdateUserData,
  type UserRepository,
} from './user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<number, User>();
  private nextId = 1;

  constructor() {
    this.seed();
  }

  async list(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getById(userId: number): Promise<User | undefined> {
    return this.users.get(userId);
  }

  async getByUsername(username: string): Promise<User | undefined> {
    const needle = username.trim().toLowerCase();
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === needle,
    );
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const needle = email.trim().toLowerCase();
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === needle,
    );
  }

  async create(data: CreateUserData): Promise<User> {
    const now = new Date();
    const user: User = {
      userId: this.nextId++,
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.userId, user);
    return user;
  }

  async update(userId: number, data: UpdateUserData): Promise<User | undefined> {
    const existing = this.users.get(userId);
    if (!existing) {
      return undefined;
    }

    const updated: User = {
      ...existing,
      username: data.username?.trim() ?? existing.username,
      email: data.email?.trim().toLowerCase() ?? existing.email,
      passwordHash: data.passwordHash ?? existing.passwordHash,
      updatedAt: new Date(),
    };

    this.users.set(userId, updated);
    return updated;
  }

  async delete(userId: number): Promise<boolean> {
    return this.users.delete(userId);
  }

  private seed(): void {
    const now = new Date();
    const seededUsers: User[] = [
      {
        userId: 1,
        username: 'john',
        email: 'john@example.com',
        passwordHash: hashSync('changeme', 10),
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: 2,
        username: 'maria',
        email: 'maria@example.com',
        passwordHash: hashSync('guess', 10),
        createdAt: now,
        updatedAt: now,
      },
    ];

    seededUsers.forEach((user) => this.users.set(user.userId, user));
    this.nextId = seededUsers.length + 1;
  }
}
