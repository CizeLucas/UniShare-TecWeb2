import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { type User } from '../domain/users/user.entity';
import { userRules } from '../domain/users/user.rules';
import { type CreateUserDto } from './dto/create-user.dto';
import { type UpdateUserDto } from './dto/update-user.dto';
import {
  USER_REPOSITORY,
  type UserRepository,
} from './repositories/user.repository';
import { type UserPublic } from './types/user-public.type';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: UserRepository,
  ) {}

  async listUsers(): Promise<UserPublic[]> {
    const users = await this.usersRepository.list();
    return users.map((user) => this.toPublicUser(user));
  }

  async getUserById(userId: number): Promise<UserPublic> {
    const user = await this.usersRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toPublicUser(user);
  }

  async createUser(input: CreateUserDto): Promise<UserPublic> {
    const normalized = this.normalizeCreateInput(input);
    const errors = userRules.validateCreate(normalized);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed.',
        errors,
      });
    }

    await this.ensureUniqueUsername(normalized.username);
    await this.ensureUniqueEmail(normalized.email);

    const passwordHash = await this.hashPassword(normalized.password);
    const created = await this.usersRepository.create({
      username: normalized.username,
      email: normalized.email,
      passwordHash,
    });

    return this.toPublicUser(created);
  }

  async updateUser(userId: number, input: UpdateUserDto): Promise<UserPublic> {
    const normalized = this.normalizeUpdateInput(input);
    const errors = userRules.validateUpdate(normalized);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed.',
        errors,
      });
    }

    const existing = await this.usersRepository.getById(userId);
    if (!existing) {
      throw new NotFoundException('User not found.');
    }

    if (normalized.username) {
      await this.ensureUniqueUsername(normalized.username, userId);
    }

    if (normalized.email) {
      await this.ensureUniqueEmail(normalized.email, userId);
    }

    const passwordHash = normalized.password
      ? await this.hashPassword(normalized.password)
      : undefined;

    const updated = await this.usersRepository.update(userId, {
      username: normalized.username,
      email: normalized.email,
      passwordHash,
    });

    if (!updated) {
      throw new NotFoundException('User not found.');
    }

    return this.toPublicUser(updated);
  }

  async removeUser(userId: number): Promise<void> {
    const deleted = await this.usersRepository.delete(userId);
    if (!deleted) {
      throw new NotFoundException('User not found.');
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.getByUsername(username);
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.usersRepository.getById(userId);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.passwordHash);
  }

  private async ensureUniqueUsername(
    username: string,
    ignoreUserId?: number,
  ): Promise<void> {
    const existing = await this.usersRepository.getByUsername(username);
    if (existing && existing.userId !== ignoreUserId) {
      throw new ConflictException('Username already in use.');
    }
  }

  private async ensureUniqueEmail(
    email: string,
    ignoreUserId?: number,
  ): Promise<void> {
    const existing = await this.usersRepository.getByEmail(email);
    if (existing && existing.userId !== ignoreUserId) {
      throw new ConflictException('Email already in use.');
    }
  }

  private normalizeCreateInput(input: CreateUserDto): CreateUserDto {
    return {
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };
  }

  private normalizeUpdateInput(input: UpdateUserDto): UpdateUserDto {
    return {
      username: input.username?.trim(),
      email: input.email?.trim().toLowerCase(),
      password: input.password,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private toPublicUser(user: User): UserPublic {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
