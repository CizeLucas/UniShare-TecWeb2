export interface Expense {
  id: string;
  description: string;
  amount: number;
  tag: 'ESSENCIAL' | 'LAZER' | 'ALIMENTACAO';
  creatorId: string;
  timeLabel: string;
  icon?: string; // se não informar, usa o ícone padrão da categoria
}

export interface WorkspaceBalance {
  userId: string;
  userName: string;
  balance: number;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  initials: string;
}

export interface Settlement {
  id: string;
  creditorName: string;
  creditorUsername: string;
  creditorInitials: string;
  amount: number;
  referenceLabel: string;
  pixKeyLabel: string;
  pixKeyValue: string;
}