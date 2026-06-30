import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthUser } from '../auth/types/auth-user.type';
import { AmbienteService } from './ambiente.service';
import { type CreateAmbienteDto } from './dto/create-ambiente.dto';

@UseGuards(JwtAuthGuard)
@Controller('ambientes')
export class AmbienteController {
  constructor(private readonly ambienteService: AmbienteService) {}

  /**
   * POST /ambientes
   * Creates a new ambiente. The authenticated user is automatically added as the first member.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() body: CreateAmbienteDto) {
    const user = req.user as AuthUser;
    return this.ambienteService.createAmbiente(user.id, body);
  }

  /**
   * GET /ambientes
   * Returns all ambientes the authenticated user is a member of.
   */
  @Get()
  async listMyAmbientes(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.ambienteService.listMyAmbientes(user.id);
  }

  /**
   * GET /ambientes/:id
   * Returns the details of a specific ambiente. Caller must be a member.
   */
  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.ambienteService.getAmbiente(user.id, id);
  }

  /**
   * GET /ambientes/:id/members
   * Returns the member list of a specific ambiente. Caller must be a member.
   */
  @Get(':id/members')
  async listMembers(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.ambienteService.listMembers(user.id, id);
  }

  /**
   * POST /ambientes/:id/join
   * Joins an ambiente using its UUID as the invite code.
   * No admin approval required — correct ID grants immediate access.
   */
  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  async join(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.ambienteService.joinAmbiente(user.id, id);
  }

  /**
   * DELETE /ambientes/:id/leave
   * Leaves an ambiente. Enforces the "Trava de Saída":
   * the user must have zero pending participations in this ambiente.
   */
  @Delete(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    await this.ambienteService.leaveAmbiente(user.id, id);
  }
}
