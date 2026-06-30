import {
  type Ambiente,
  type AmbienteTipo,
} from '../../domain/ambiente/ambiente.entity';

export type CreateAmbienteData = {
  nome: string;
  tipo: AmbienteTipo;
};

export type AmbienteMember = {
  userId: string;
  ambienteId: string;
  entradaEm: Date;
};

export const AMBIENTE_REPOSITORY = Symbol('AMBIENTE_REPOSITORY');

export interface AmbienteRepository {
  /** Returns the ambiente with the given id, or undefined if it does not exist. */
  getById(id: string): Promise<Ambiente | undefined>;

  /** Returns all ambientes that the given user is a member of. */
  listByUserId(userId: string): Promise<Ambiente[]>;

  /** Persists a new ambiente and returns the created domain object. */
  create(data: CreateAmbienteData): Promise<Ambiente>;

  /** Adds a user to an ambiente (creates a UserAmbiente pivot row). */
  addMember(userId: string, ambienteId: string): Promise<void>;

  /** Returns true if the given user is already a member of the given ambiente. */
  isMember(userId: string, ambienteId: string): Promise<boolean>;

  /**
   * Returns the number of ExpenseParticipations for the given user in the given
   * ambiente whose status is NOT 'PAGO'. Used to enforce the "Trava de Saída".
   */
  countPendingParticipations(
    userId: string,
    ambienteId: string,
  ): Promise<number>;

  /** Removes a user from an ambiente (deletes the UserAmbiente pivot row). */
  removeMember(userId: string, ambienteId: string): Promise<void>;

  /** Returns all members of the given ambiente. */
  listMembers(ambienteId: string): Promise<AmbienteMember[]>;
}
