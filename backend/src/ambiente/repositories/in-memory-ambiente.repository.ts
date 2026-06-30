/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'crypto';
import {
  type Ambiente,
  type AmbienteTipo,
} from '../../domain/ambiente/ambiente.entity';
import {
  type AmbienteMember,
  type AmbienteRepository,
  type CreateAmbienteData,
} from './ambiente.repository';

type PivotKey = `${string}:${string}`;

export class InMemoryAmbienteRepository implements AmbienteRepository {
  private readonly ambientes = new Map<string, Ambiente>();
  private readonly memberships = new Map<PivotKey, AmbienteMember>();
  // Simulates pending participation counts per (userId, ambienteId)
  private readonly pendingCounts = new Map<PivotKey, number>();

  private pivotKey(userId: string, ambienteId: string): PivotKey {
    return `${userId}:${ambienteId}`;
  }

  async getById(id: string): Promise<Ambiente | undefined> {
    return this.ambientes.get(id);
  }

  async listByUserId(userId: string): Promise<Ambiente[]> {
    return Array.from(this.memberships.values())
      .filter((m) => m.userId === userId)
      .map((m) => this.ambientes.get(m.ambienteId))
      .filter((a): a is Ambiente => a !== undefined);
  }

  async create(data: CreateAmbienteData): Promise<Ambiente> {
    const ambiente: Ambiente = {
      id: randomUUID(),
      nome: data.nome.trim(),
      tipo: data.tipo as AmbienteTipo,
    };
    this.ambientes.set(ambiente.id, ambiente);
    return ambiente;
  }

  async addMember(userId: string, ambienteId: string): Promise<void> {
    const key = this.pivotKey(userId, ambienteId);
    this.memberships.set(key, { userId, ambienteId, entradaEm: new Date() });
  }

  async isMember(userId: string, ambienteId: string): Promise<boolean> {
    return this.memberships.has(this.pivotKey(userId, ambienteId));
  }

  async countPendingParticipations(
    userId: string,
    ambienteId: string,
  ): Promise<number> {
    return this.pendingCounts.get(this.pivotKey(userId, ambienteId)) ?? 0;
  }

  async removeMember(userId: string, ambienteId: string): Promise<void> {
    this.memberships.delete(this.pivotKey(userId, ambienteId));
  }

  async listMembers(ambienteId: string): Promise<AmbienteMember[]> {
    return Array.from(this.memberships.values()).filter(
      (m) => m.ambienteId === ambienteId,
    );
  }

  /** Test helper — seed a pending participation count for a user in an ambiente. */
  setPendingCount(userId: string, ambienteId: string, count: number): void {
    this.pendingCounts.set(this.pivotKey(userId, ambienteId), count);
  }
}
