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

  /**
   * GET /users/me — returns the authenticated user's public profile.
   */
  async getMe(userId: string): Promise<UserPublic> {
    const user = await this.usersRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.toPublicUser(user);
  }

  /**
   * PATCH /users/me — partial update of the authenticated user's profile.
   */
  async updateMe(userId: string, input: UpdateUserDto): Promise<UserPublic> {
    const errors = userRules.validateUpdate({
      name: input.name,
      pixKey: input.pixKey,
      pixKeyType: input.pixKeyType,
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed.', errors });
    }

    const updated = await this.usersRepository.update(userId, {
      name: input.name,
      pixChave: input.pixKey,
      pixTipo: input.pixKeyType,
    });

    if (!updated) {
      throw new NotFoundException('User not found.');
    }

    return this.toPublicUser(updated);
  }

  /**
   * POST /auth/register — creates a new user account.
   */
  async createUser(input: CreateUserDto): Promise<UserPublic> {
    const errors = userRules.validateCreate({
      name: input.name,
      email: input.email,
      password: input.password,
      pixKey: input.pixKey,
      pixKeyType: input.pixKeyType,
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed.', errors });
    }

    await this.ensureUniqueEmail(input.email.trim().toLowerCase());

    const passwordHash = await hash(input.password, 10);

    const created = await this.usersRepository.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      pixChave: input.pixKey,
      pixTipo: input.pixKeyType,
    });

    return this.toPublicUser(created);
  }

  // ── Helpers consumed by Auth ─────────────────────────────────────────────

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.getByEmail(email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.getById(id);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.passwordHash);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private async ensureUniqueEmail(
    email: string,
    ignoreId?: string,
  ): Promise<void> {
    const existing = await this.usersRepository.getByEmail(email);
    if (existing && existing.id !== ignoreId) {
      throw new ConflictException('Email already in use.');
    }
  }

  private toPublicUser(user: User): UserPublic {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      pixKey: user.pixChave ?? null,
      pixKeyType: user.pixTipo ?? null,
      createdAt: user.createdAt,
    };
  }
}
