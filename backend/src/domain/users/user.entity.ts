export type PixTipo = 'CPF' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  pixChave?: string;
  pixTipo?: PixTipo;
  createdAt: Date;
};
