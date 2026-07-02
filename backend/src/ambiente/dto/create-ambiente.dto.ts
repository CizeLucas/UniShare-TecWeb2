import { type AmbienteTipo } from '../../domain/ambiente/ambiente.entity';

export type CreateAmbienteDto = {
  nome: string;
  tipo: AmbienteTipo;
};
