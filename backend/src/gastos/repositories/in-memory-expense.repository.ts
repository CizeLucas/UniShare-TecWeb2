/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'crypto';
import {
  type Expense,
  type ExpenseParticipation,
  type ExpenseTag,
  type ParticipationStatus,
} from '../../domain/gastos/expense.entity';
import {
  type CreateExpenseData,
  type CreateParticipationData,
  type ExpenseRepository,
} from './expense.repository';

export class InMemoryExpenseRepository implements ExpenseRepository {
  private readonly expenses = new Map<string, Expense>();
  private readonly participations = new Map<string, ExpenseParticipation[]>();

  async getById(
    id: string,
  ): Promise<
    (Expense & { participations: ExpenseParticipation[] }) | undefined
  > {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    return {
      ...expense,
      participations: this.participations.get(id) ?? [],
    };
  }

  async listByAmbienteId(ambienteId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((e) => e.ambienteId === ambienteId)
      .sort((a, b) => b.criadaEm.getTime() - a.criadaEm.getTime());
  }

  async createWithParticipations(
    expenseData: CreateExpenseData,
    participationsData: CreateParticipationData[],
  ): Promise<{ expense: Expense; participations: ExpenseParticipation[] }> {
    const expense: Expense = {
      id: randomUUID(),
      ambienteId: expenseData.ambienteId,
      creatorId: expenseData.creatorId,
      pagadorId: expenseData.pagadorId,
      titulo: expenseData.titulo.trim(),
      valorTotal: expenseData.valorTotal,
      tag: expenseData.tag as ExpenseTag,
      criadaEm: new Date(),
    };

    const participations: ExpenseParticipation[] = participationsData.map(
      (p) => ({
        id: randomUUID(),
        expenseId: expense.id,
        userId: p.userId,
        porcentagem: p.porcentagem,
        valorCalculado: p.valorCalculado,
        valorPago: 0,
        status: p.status as ParticipationStatus,
        pagoEm: null,
      }),
    );

    this.expenses.set(expense.id, expense);
    this.participations.set(expense.id, participations);

    return { expense, participations };
  }
}
