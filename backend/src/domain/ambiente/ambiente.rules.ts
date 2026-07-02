import { type AmbienteTipo } from './ambiente.entity';

export type CreateAmbienteInput = {
  nome: string;
  tipo: AmbienteTipo;
};

export type AmbienteValidationError = {
  field: 'nome' | 'tipo';
  message: string;
};

const VALID_TIPOS: AmbienteTipo[] = ['RESIDENCIA', 'ATIVIDADE'];

export const ambienteRules = {
  validateCreate(input: CreateAmbienteInput): AmbienteValidationError[] {
    const errors: AmbienteValidationError[] = [];

    if (!input.nome || input.nome.trim().length < 3) {
      errors.push({
        field: 'nome',
        message: 'O nome do ambiente deve ter pelo menos 3 caracteres.',
      });
    }

    if (!input.tipo || !VALID_TIPOS.includes(input.tipo)) {
      errors.push({
        field: 'tipo',
        message: `O tipo deve ser um dos seguintes: ${VALID_TIPOS.join(', ')}.`,
      });
    }

    return errors;
  },

  /**
   * Enforces the "Trava de Saída" rule:
   * A user may only leave an ambiente if they have zero pending participations.
   * @param pendingCount - Number of ExpenseParticipations with status != 'PAGO'
   */
  canUserLeave(pendingCount: number): boolean {
    return pendingCount === 0;
  },
};
