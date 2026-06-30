/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  type PixTipo as DomainPixTipo,
  type User,
} from '../../domain/users/user.entity';
import { DatabaseService } from '../../database/database.service';
import { type PixTipo as PrismaPixTipo } from '../../generated/prisma/enums';
import {
  type CreateUserData,
  type UpdateUserData,
  type UserRepository,
} from './user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(id: string): Promise<User | undefined> {
    const row = await this.db.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : undefined;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const row = await this.db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    return row ? this.toDomain(row) : undefined;
  }

  async create(data: CreateUserData): Promise<User> {
    const row = await this.db.user.create({
      data: {
        nome: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        senhaHash: data.passwordHash,
        pixChave: data.pixChave ?? null,
        pixTipo: data.pixTipo ? (data.pixTipo as PrismaPixTipo) : null,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: UpdateUserData): Promise<User | undefined> {
    const existing = await this.db.user.findUnique({ where: { id } });
    if (!existing) return undefined;

    const row = await this.db.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { nome: data.name.trim() }),
        ...(data.pixChave !== undefined && { pixChave: data.pixChave }),
        ...(data.pixTipo !== undefined && {
          pixTipo: data.pixTipo as PrismaPixTipo,
        }),
      },
    });
    return this.toDomain(row);
  }

  // Maps the Prisma User row (DB field names) → domain User entity
  private toDomain(row: {
    id: string;
    nome: string;
    email: string;
    senhaHash: string;
    pixChave: string | null;
    pixTipo: PrismaPixTipo | null;
    criadoEm: Date;
  }): User {
    return {
      id: row.id,
      name: row.nome,
      email: row.email,
      passwordHash: row.senhaHash,
      pixChave: row.pixChave ?? undefined,
      pixTipo: (row.pixTipo as DomainPixTipo) ?? undefined,
      createdAt: row.criadoEm,
    };
  }
}
