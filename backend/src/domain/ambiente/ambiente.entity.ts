export type AmbienteTipo = 'RESIDENCIA' | 'ATIVIDADE';

export type Ambiente = {
  id: string;
  nome: string;
  tipo: AmbienteTipo;
};

export type UserAmbiente = {
  userId: string;
  ambienteId: string;
  entradaEm: Date;
};
