import { Expense, WorkspaceBalance } from './types';
import { WorkspaceMember } from './types';
import { Settlement } from './types';

export const mockBalances: WorkspaceBalance[] = [
  { userId: '1', userName: 'Você', balance: -45.50 },
  { userId: '2', userName: 'Maria', balance: 20.00 },
  { userId: '3', userName: 'João', balance: 25.50 },
];

export const mockExpenses: Expense[] = [
  {
    id: 'a1',
    description: 'Energia Abril',
    amount: 150,
    tag: 'ESSENCIAL',
    creatorId: '2',
    timeLabel: 'Ontem',
  },
  {
    id: 'a2',
    description: 'Pizza Republica',
    amount: 80,
    tag: 'LAZER',
    creatorId: '3',
    timeLabel: '2 dias atrás',
    icon: 'local_pizza',
  },
  {
    id: 'a3',
    description: 'Internet',
    amount: 96,
    tag: 'ESSENCIAL',
    creatorId: '3',
    timeLabel: 'Hoje',
  },
];

export const mockMembers: WorkspaceMember[] = [
  { id: '1', name: 'Você', initials: 'V' },
  { id: '2', name: 'Ana', initials: 'A' },
  { id: '3', name: 'Carlos', initials: 'C' },
  { id: '4', name: 'Maria', initials: 'M' },
];

export const mockSettlement: Settlement = {
  id: 's1',
  creditorName: 'Lucas Silva',
  creditorUsername: '@lucas_silva',
  creditorInitials: 'LS',
  amount: 45.5,
  referenceLabel: 'Referente ao saldo líquido do mês de Abril',
  pixKeyLabel: 'Chave PIX (Telefone)',
  pixKeyValue: '+55 (11) 98765-4321',
};