/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  type Ambiente,
  type AmbienteTipo as DomainAmbienteTipo,
} from '../../domain/ambiente/ambiente.entity';
import { DatabaseService } from '../../database/database.service';
import { type AmbienteTipo as PrismaAmbienteTipo } from '../../generated/prisma/enums';
import {
  type AmbienteMember,
  type AmbienteRepository,
  type CreateAmbienteData,
} from './ambiente.repository';

@Injectable()
export class PrismaAmbienteRepository implements AmbienteRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(id: string): Promise<Ambiente | undefined> {
    const row = await this.db.ambiente.findUnique({ where: { id } });
    return row ? this.toDomain(row) : undefined;
  }

  async listByUserId(userId: string): Promise<Ambiente[]> {
    const pivots = await this.db.userAmbiente.findMany({
      where: { userId },
      include: { ambiente: true },
    });
    return pivots.map((p) => this.toDomain(p.ambiente));
  }

  async create(data: CreateAmbienteData): Promise<Ambiente> {
    const row = await this.db.ambiente.create({
      data: {
        nome: data.nome.trim(),
        tipo: data.tipo as PrismaAmbienteTipo,
      },
    });
    return this.toDomain(row);
  }

  async addMember(userId: string, ambienteId: string): Promise<void> {
    await this.db.userAmbiente.create({ data: { userId, ambienteId } });
  }

  async isMember(userId: string, ambienteId: string): Promise<boolean> {
    const pivot = await this.db.userAmbiente.findUnique({
      where: { userId_ambienteId: { userId, ambienteId } },
    });
    return pivot !== null;
  }

  async countPendingParticipations(
    userId: string,
    ambienteId: string,
  ): Promise<number> {
    return this.db.expenseParticipation.count({
      where: {
        userId,
        expense: { ambienteId },
        status: { not: 'PAGO' },
      },
    });
  }

  async removeMember(userId: string, ambienteId: string): Promise<void> {
    await this.db.userAmbiente.delete({
      where: { userId_ambienteId: { userId, ambienteId } },
    });
  }

  async listMembers(ambienteId: string): Promise<AmbienteMember[]> {
    const pivots = await this.db.userAmbiente.findMany({
      where: { ambienteId },
    });
    return pivots.map((p) => ({
      userId: p.userId,
      ambienteId: p.ambienteId,
      entradaEm: p.entradaEm,
    }));
  }

  // Maps the Prisma Ambiente row (DB field names) → domain Ambiente entity
  private toDomain(row: {
    id: string;
    nome: string;
    tipo: PrismaAmbienteTipo;
  }): Ambiente {
    return {
      id: row.id,
      nome: row.nome,
      tipo: row.tipo as DomainAmbienteTipo,
    };
  }
}
