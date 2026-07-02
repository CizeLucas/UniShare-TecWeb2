import { type ExpenseTag } from '../../domain/gastos/expense.entity';

export type ParticipacaoDto = {
  userId: string;
  porcentagem: number;
};

export type CreateExpenseDto = {
  ambienteId: string;
  pagadorId: string;
  titulo: string;
  valorTotal: number;
  tag: ExpenseTag;
  participacoes: ParticipacaoDto[];
};
