export type ExpenseTag = 'ESSENCIAL' | 'LAZER';

export type ParticipationStatus = 'PENDENTE' | 'PAGO' | 'EM_ANALISE';

export type Expense = {
  id: string;
  ambienteId: string;
  creatorId: string;
  pagadorId: string;
  titulo: string;
  valorTotal: number;
  tag: ExpenseTag;
  criadaEm: Date;
};

export type ExpenseParticipation = {
  id: string;
  expenseId: string;
  userId: string;
  porcentagem: number;
  valorCalculado: number;
  valorPago: number;
  status: ParticipationStatus;
  pagoEm: Date | null;
};
