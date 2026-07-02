import {
  Body,
  Controller,
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
import { GastosService } from './gastos.service';
import { type CreateExpenseDto } from './dto/create-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  /**
   * POST /gastos
   * Creates a new expense with all its participations.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() body: CreateExpenseDto) {
    const user = req.user as AuthUser;
    return this.gastosService.createExpense(user.id, body);
  }

  /**
   * GET /gastos/ambiente/:ambienteId
   * Lists all expenses within an ambiente. Caller must be a member.
   */
  @Get('ambiente/:ambienteId')
  async listByAmbiente(
    @Req() req: Request,
    @Param('ambienteId') ambienteId: string,
  ) {
    const user = req.user as AuthUser;
    return this.gastosService.listExpenses(user.id, ambienteId);
  }

  /**
   * GET /gastos/:id
   * Returns details of a specific expense, including all participations.
   */
  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    return this.gastosService.getExpense(user.id, id);
  }
}
