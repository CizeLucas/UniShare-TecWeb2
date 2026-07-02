import { type AmbienteTipo } from '../../domain/ambiente/ambiente.entity';

export type AmbientePublic = {
  id: string;
  nome: string;
  tipo: AmbienteTipo;
};

export type AmbienteMemberPublic = {
  userId: string;
  entradaEm: Date;
};
