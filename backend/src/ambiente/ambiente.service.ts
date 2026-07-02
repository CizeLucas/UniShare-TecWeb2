import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type Ambiente } from '../domain/ambiente/ambiente.entity';
import { ambienteRules } from '../domain/ambiente/ambiente.rules';
import { type CreateAmbienteDto } from './dto/create-ambiente.dto';
import {
  AMBIENTE_REPOSITORY,
  type AmbienteRepository,
} from './repositories/ambiente.repository';
import {
  type AmbienteMemberPublic,
  type AmbientePublic,
} from './types/ambiente-public.type';

@Injectable()
export class AmbienteService {
  constructor(
    @Inject(AMBIENTE_REPOSITORY)
    private readonly ambienteRepository: AmbienteRepository,
  ) {}

  /**
   * POST /ambientes
   * Creates a new ambiente and automatically adds the creator as the first member.
   */
  async createAmbiente(
    userId: string,
    input: CreateAmbienteDto,
  ): Promise<AmbientePublic> {
    const errors = ambienteRules.validateCreate({
      nome: input.nome,
      tipo: input.tipo,
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed.', errors });
    }

    const ambiente = await this.ambienteRepository.create({
      nome: input.nome,
      tipo: input.tipo,
    });

    // Creator is automatically added as the first member
    await this.ambienteRepository.addMember(userId, ambiente.id);

    return this.toPublic(ambiente);
  }

  /**
   * GET /ambientes
   * Lists all ambientes the authenticated user belongs to.
   */
  async listMyAmbientes(userId: string): Promise<AmbientePublic[]> {
    const ambientes = await this.ambienteRepository.listByUserId(userId);
    return ambientes.map((a) => this.toPublic(a));
  }

  /**
   * GET /ambientes/:id
   * Returns the ambiente detail if the caller is a member.
   */
  async getAmbiente(
    userId: string,
    ambienteId: string,
  ): Promise<AmbientePublic> {
    const ambiente = await this.findAmbienteOrThrow(ambienteId);
    await this.requireMembership(userId, ambienteId);
    return this.toPublic(ambiente);
  }

  /**
   * POST /ambientes/:id/join
   * Joins an ambiente by its UUID code (the id IS the invite code).
   * No admin approval — correct code means access granted.
   */
  async joinAmbiente(
    userId: string,
    ambienteId: string,
  ): Promise<AmbientePublic> {
    const ambiente = await this.findAmbienteOrThrow(ambienteId);

    const alreadyMember = await this.ambienteRepository.isMember(
      userId,
      ambienteId,
    );
    if (alreadyMember) {
      throw new ConflictException('Você já é membro deste ambiente.');
    }

    await this.ambienteRepository.addMember(userId, ambienteId);
    return this.toPublic(ambiente);
  }

  /**
   * DELETE /ambientes/:id/leave
   * Removes the caller from the ambiente.
   * Enforces the "Trava de Saída": the user may only leave if all their
   * participations in that ambiente are fully paid (status = PAGO).
   */
  async leaveAmbiente(userId: string, ambienteId: string): Promise<void> {
    await this.findAmbienteOrThrow(ambienteId);
    await this.requireMembership(userId, ambienteId);

    const pendingCount =
      await this.ambienteRepository.countPendingParticipations(
        userId,
        ambienteId,
      );

    if (!ambienteRules.canUserLeave(pendingCount)) {
      throw new ForbiddenException(
        `Você possui ${pendingCount} participação(ões) pendente(s) neste ambiente. ` +
          'Quite todas as dívidas antes de sair.',
      );
    }

    await this.ambienteRepository.removeMember(userId, ambienteId);
  }

  /**
   * GET /ambientes/:id/members
   * Returns all members of the ambiente (caller must be a member).
   */
  async listMembers(
    userId: string,
    ambienteId: string,
  ): Promise<AmbienteMemberPublic[]> {
    await this.findAmbienteOrThrow(ambienteId);
    await this.requireMembership(userId, ambienteId);

    const members = await this.ambienteRepository.listMembers(ambienteId);
    return members.map((m) => ({
      userId: m.userId,
      entradaEm: m.entradaEm,
    }));
  }

  /**
   * Checks if a user is a member of an ambiente.
   */
  async isMember(userId: string, ambienteId: string): Promise<boolean> {
    return this.ambienteRepository.isMember(userId, ambienteId);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private async findAmbienteOrThrow(ambienteId: string): Promise<Ambiente> {
    const ambiente = await this.ambienteRepository.getById(ambienteId);
    if (!ambiente) {
      throw new NotFoundException('Ambiente não encontrado.');
    }
    return ambiente;
  }

  private async requireMembership(
    userId: string,
    ambienteId: string,
  ): Promise<void> {
    const isMember = await this.ambienteRepository.isMember(userId, ambienteId);
    if (!isMember) {
      throw new ForbiddenException('Você não é membro deste ambiente.');
    }
  }

  private toPublic(ambiente: Ambiente): AmbientePublic {
    return {
      id: ambiente.id,
      nome: ambiente.nome,
      tipo: ambiente.tipo,
    };
  }
}
