import {
  type ExpenseTag,
  type ParticipationStatus,
} from '../../domain/gastos/expense.entity';

export type ParticipationPublic = {
  id: string;
  userId: string;
  porcentagem: number;
  valorCalculado: number;
  valorPago: number;
  status: ParticipationStatus;
  pagoEm: Date | null;
};

export type ExpensePublic = {
  id: string;
  ambienteId: string;
  creatorId: string;
  pagadorId: string;
  titulo: string;
  valorTotal: number;
  tag: ExpenseTag;
  criadaEm: Date;
};

export type ExpenseWithParticipationsPublic = ExpensePublic & {
  participacoes: ParticipationPublic[];
};
