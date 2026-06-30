import {
  type Expense,
  type ExpenseParticipation,
  type ExpenseTag,
  type ParticipationStatus,
} from '../../domain/gastos/expense.entity';

export type CreateExpenseData = {
  ambienteId: string;
  creatorId: string;
  pagadorId: string;
  titulo: string;
  valorTotal: number;
  tag: ExpenseTag;
};

export type CreateParticipationData = {
  userId: string;
  porcentagem: number;
  valorCalculado: number;
  status: ParticipationStatus;
};

export const EXPENSE_REPOSITORY = Symbol('EXPENSE_REPOSITORY');

export interface ExpenseRepository {
  /** Returns the expense with the given id, or undefined if it does not exist. */
  getById(id: string): Promise<
    | (Expense & { participations: ExpenseParticipation[] })
    | undefined
  >;

  /** Returns all expenses in the given ambiente, ordered by criadaEm descending. */
  listByAmbienteId(ambienteId: string): Promise<Expense[]>;

  /**
   * Atomically creates one Expense row and all its ExpenseParticipation rows.
   * Must be executed in a single DB transaction.
   */
  createWithParticipations(
    expense: CreateExpenseData,
    participations: CreateParticipationData[],
  ): Promise<{ expense: Expense; participations: ExpenseParticipation[] }>;
}
