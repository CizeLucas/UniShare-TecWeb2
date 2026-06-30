import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  type Expense,
  type ExpenseParticipation,
} from '../domain/gastos/expense.entity';
import { expenseRules } from '../domain/gastos/expense.rules';
import { AmbienteService } from '../ambiente/ambiente.service';
import { UsersService } from '../users/users.service';
import { type CreateExpenseDto } from './dto/create-expense.dto';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
} from './repositories/expense.repository';
import {
  type ExpensePublic,
  type ExpenseWithParticipationsPublic,
  type ParticipationPublic,
} from './types/expense-public.type';

@Injectable()
export class GastosService {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepository,
    private readonly ambienteService: AmbienteService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * POST /gastos
   * Creates a new expense with all participation quotas.
   *
   * Validation pipeline:
   * 1. Domain rule validation (expenseRules.validateCreate)
   * 2. Ambiente exists and creator is a member
   * 3. pagadorId is a member and has a PIX key set
   * 4. All participant userIds are members of the ambiente
   * 5. Calculate valorCalculado with rounding rule (expenseRules.calcularParticipacoes)
   * 6. Persist atomically (expense + participations in one DB write)
   */
  async createExpense(
    creatorId: string,
    dto: CreateExpenseDto,
  ): Promise<ExpenseWithParticipationsPublic> {
    // 1. Domain validation
    const errors = expenseRules.validateCreate({
      titulo: dto.titulo,
      valorTotal: dto.valorTotal,
      tag: dto.tag,
      pagadorId: dto.pagadorId,
      participacoes: dto.participacoes,
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed.', errors });
    }

    // 2. Check ambiente membership for the creator
    await this.ambienteService.getAmbiente(creatorId, dto.ambienteId);

    // 3. Check pagador membership and PIX key
    const pagador = await this.usersService.findById(dto.pagadorId);
    if (!pagador) {
      throw new NotFoundException('Pagador não encontrado.');
    }

    const pagadorIsMember = await this.ambienteService.isMember(
      dto.pagadorId,
      dto.ambienteId,
    );
    if (!pagadorIsMember) {
      throw new ForbiddenException(
        'O pagador selecionado não é membro deste ambiente.',
      );
    }

    if (!pagador.pixChave) {
      throw new UnprocessableEntityException(
        'O pagador selecionado não possui uma chave PIX cadastrada. ' +
          'Apenas usuários com chave PIX podem ser selecionados como Pagador Original.',
      );
    }

    // 4. Check all participant memberships
    await this.validateParticipantMemberships(
      dto.participacoes.map((p) => p.userId),
      dto.ambienteId,
    );

    // 5. Calculate valorCalculado with rounding rule
    const calculadas = expenseRules.calcularParticipacoes(
      dto.valorTotal,
      dto.participacoes,
      dto.pagadorId,
    );

    // 6. Persist atomically
    const { expense, participations } =
      await this.expenseRepository.createWithParticipations(
        {
          ambienteId: dto.ambienteId,
          creatorId,
          pagadorId: dto.pagadorId,
          titulo: dto.titulo,
          valorTotal: Number(dto.valorTotal),
          tag: dto.tag,
        },
        calculadas.map((c) => ({
          userId: c.userId,
          porcentagem: c.porcentagem,
          valorCalculado: c.valorCalculado,
          status: 'PENDENTE' as const,
        })),
      );

    return this.toPublicWithParticipations(expense, participations);
  }

  /**
   * GET /gastos/ambiente/:ambienteId
   * Lists all expenses in an ambiente. Caller must be a member.
   */
  async listExpenses(
    userId: string,
    ambienteId: string,
  ): Promise<ExpensePublic[]> {
    // Verifies existence and membership (throws 404/403 otherwise)
    await this.ambienteService.getAmbiente(userId, ambienteId);

    const expenses = await this.expenseRepository.listByAmbienteId(ambienteId);
    return expenses.map((e) => this.toPublic(e));
  }

  /**
   * GET /gastos/:id
   * Returns a single expense with all its participations. Caller must be a member.
   */
  async getExpense(
    userId: string,
    expenseId: string,
  ): Promise<ExpenseWithParticipationsPublic> {
    const result = await this.expenseRepository.getById(expenseId);
    if (!result) {
      throw new NotFoundException('Despesa não encontrada.');
    }

    // Verify the caller is a member of the expense's ambiente
    await this.ambienteService.getAmbiente(userId, result.ambienteId);

    return this.toPublicWithParticipations(result, result.participations);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private async validateParticipantMemberships(
    userIds: string[],
    ambienteId: string,
  ): Promise<void> {
    for (const userId of userIds) {
      const isMember = await this.ambienteService.isMember(userId, ambienteId);
      if (!isMember) {
        throw new ForbiddenException(
          `O usuário ${userId} não é membro deste ambiente e não pode ser incluído como participante.`,
        );
      }
    }
  }

  private toPublic(expense: Expense): ExpensePublic {
    return {
      id: expense.id,
      ambienteId: expense.ambienteId,
      creatorId: expense.creatorId,
      pagadorId: expense.pagadorId,
      titulo: expense.titulo,
      valorTotal: expense.valorTotal,
      tag: expense.tag,
      criadaEm: expense.criadaEm,
    };
  }

  private toParticipationPublic(p: ExpenseParticipation): ParticipationPublic {
    return {
      id: p.id,
      userId: p.userId,
      porcentagem: p.porcentagem,
      valorCalculado: p.valorCalculado,
      valorPago: p.valorPago,
      status: p.status,
      pagoEm: p.pagoEm,
    };
  }

  private toPublicWithParticipations(
    expense: Expense,
    participations: ExpenseParticipation[],
  ): ExpenseWithParticipationsPublic {
    return {
      ...this.toPublic(expense),
      participacoes: participations.map((p) => this.toParticipationPublic(p)),
    };
  }
}
