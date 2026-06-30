/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  type Expense,
  type ExpenseParticipation,
  type ExpenseTag as DomainExpenseTag,
  type ParticipationStatus as DomainParticipationStatus,
} from '../../domain/gastos/expense.entity';
import { DatabaseService } from '../../database/database.service';
import {
  type ExpenseTag as PrismaExpenseTag,
  type ParticipationStatus as PrismaParticipationStatus,
} from '../../generated/prisma/enums';
import {
  type CreateExpenseData,
  type CreateParticipationData,
  type ExpenseRepository,
} from './expense.repository';

@Injectable()
export class PrismaExpenseRepository implements ExpenseRepository {
  constructor(private readonly db: DatabaseService) {}

  async getById(
    id: string,
  ): Promise<
    (Expense & { participations: ExpenseParticipation[] }) | undefined
  > {
    const row = await this.db.expense.findUnique({
      where: { id },
      include: { participacoes: true },
    });

    if (!row) return undefined;

    return {
      ...this.toDomain(row),
      participations: row.participacoes.map((p) =>
        this.toParticipationDomain(p),
      ),
    };
  }

  async listByAmbienteId(ambienteId: string): Promise<Expense[]> {
    const rows = await this.db.expense.findMany({
      where: { ambienteId },
      orderBy: { criadaEm: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async createWithParticipations(
    expense: CreateExpenseData,
    participations: CreateParticipationData[],
  ): Promise<{ expense: Expense; participations: ExpenseParticipation[] }> {
    // Prisma wraps nested writes in an implicit transaction — atomic by design.
    const row = await this.db.expense.create({
      data: {
        ambienteId: expense.ambienteId,
        creatorId: expense.creatorId,
        pagadorId: expense.pagadorId,
        titulo: expense.titulo.trim(),
        valorTotal: expense.valorTotal,
        tag: expense.tag as PrismaExpenseTag,
        participacoes: {
          createMany: {
            data: participations.map((p) => ({
              userId: p.userId,
              porcentagem: p.porcentagem,
              valorCalculado: p.valorCalculado,
              valorPago: 0,
              status: p.status as PrismaParticipationStatus,
            })),
          },
        },
      },
      include: { participacoes: true },
    });

    return {
      expense: this.toDomain(row),
      participations: row.participacoes.map((p) =>
        this.toParticipationDomain(p),
      ),
    };
  }

  // ── Mappers ──────────────────────────────────────────────────────────────

  private toDomain(row: {
    id: string;
    ambienteId: string;
    creatorId: string;
    pagadorId: string;
    titulo: string;
    valorTotal: { toNumber(): number };
    tag: PrismaExpenseTag;
    criadaEm: Date;
  }): Expense {
    return {
      id: row.id,
      ambienteId: row.ambienteId,
      creatorId: row.creatorId,
      pagadorId: row.pagadorId,
      titulo: row.titulo,
      valorTotal: row.valorTotal.toNumber(),
      tag: row.tag as DomainExpenseTag,
      criadaEm: row.criadaEm,
    };
  }

  private toParticipationDomain(row: {
    id: string;
    expenseId: string;
    userId: string;
    porcentagem: { toNumber(): number };
    valorCalculado: { toNumber(): number };
    valorPago: { toNumber(): number };
    status: PrismaParticipationStatus;
    pagoEm: Date | null;
  }): ExpenseParticipation {
    return {
      id: row.id,
      expenseId: row.expenseId,
      userId: row.userId,
      porcentagem: row.porcentagem.toNumber(),
      valorCalculado: row.valorCalculado.toNumber(),
      valorPago: row.valorPago.toNumber(),
      status: row.status as DomainParticipationStatus,
      pagoEm: row.pagoEm,
    };
  }
}
