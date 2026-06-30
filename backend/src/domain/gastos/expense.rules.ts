import { type ExpenseTag } from './expense.entity';

export type ParticipacaoInput = {
  userId: string;
  porcentagem: number;
};

export type CreateExpenseInput = {
  titulo: string;
  valorTotal: number;
  tag: ExpenseTag;
  pagadorId: string;
  participacoes: ParticipacaoInput[];
};

export type ExpenseValidationError = {
  field: 'titulo' | 'valorTotal' | 'tag' | 'pagadorId' | 'participacoes';
  message: string;
};

export type ParticipacaoCalculada = {
  userId: string;
  porcentagem: number;
  valorCalculado: number;
};

const VALID_TAGS: ExpenseTag[] = ['ESSENCIAL', 'LAZER'];

/** Truncates a number to 2 decimal places without rounding. */
function truncate2(value: number): number {
  return Math.floor(value * 100) / 100;
}

export const expenseRules = {
  validateCreate(input: CreateExpenseInput): ExpenseValidationError[] {
    const errors: ExpenseValidationError[] = [];

    if (!input.titulo || input.titulo.trim().length < 3) {
      errors.push({
        field: 'titulo',
        message: 'O título da despesa deve ter pelo menos 3 caracteres.',
      });
    }

    if (!input.valorTotal || Number(input.valorTotal) <= 0) {
      errors.push({
        field: 'valorTotal',
        message: 'O valor total deve ser maior que zero.',
      });
    }

    if (!input.tag || !VALID_TAGS.includes(input.tag)) {
      errors.push({
        field: 'tag',
        message: `A tag deve ser uma das seguintes: ${VALID_TAGS.join(', ')}.`,
      });
    }

    if (!input.pagadorId || input.pagadorId.trim().length === 0) {
      errors.push({
        field: 'pagadorId',
        message: 'O pagadorId é obrigatório.',
      });
    }

    if (!input.participacoes || input.participacoes.length === 0) {
      errors.push({
        field: 'participacoes',
        message: 'É necessário ao menos um participante.',
      });
    } else {
      const soma = input.participacoes.reduce(
        (acc, p) => acc + Number(p.porcentagem),
        0,
      );
      // Allow ±0.01 tolerance for floating-point representation errors
      if (Math.abs(soma - 100) > 0.01) {
        errors.push({
          field: 'participacoes',
          message: `A soma das porcentagens deve ser exatamente 100%. Soma atual: ${soma.toFixed(2)}%.`,
        });
      }
    }

    return errors;
  },

  /**
   * Calculates the valorCalculado for each participant.
   *
   * Algorithm (from the business rules doc):
   * 1. Truncate each share to 2 decimal places: truncate(valorTotal × pct / 100)
   * 2. Sum all truncated values; the difference with valorTotal is the "remainder"
   *    caused by truncation (always ≥ 0).
   * 3. Add the remainder to the pagador's entry so the totals always balance.
   */
  calcularParticipacoes(
    valorTotal: number,
    participacoes: ParticipacaoInput[],
    pagadorId: string,
  ): ParticipacaoCalculada[] {
    const resultado: ParticipacaoCalculada[] = participacoes.map((p) => ({
      userId: p.userId,
      porcentagem: Number(p.porcentagem),
      valorCalculado: truncate2(
        (Number(valorTotal) * Number(p.porcentagem)) / 100,
      ),
    }));

    const somaCalculada = resultado.reduce(
      (acc, r) => acc + r.valorCalculado,
      0,
    );

    // Remainder in cents — add to pagador's quota
    const remainder = Math.round((valorTotal - somaCalculada) * 100) / 100;

    if (remainder > 0) {
      const pagadorEntry = resultado.find((r) => r.userId === pagadorId);
      if (pagadorEntry) {
        pagadorEntry.valorCalculado =
          Math.round((pagadorEntry.valorCalculado + remainder) * 100) / 100;
      }
    }

    return resultado;
  },
};
