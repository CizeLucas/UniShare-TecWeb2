import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseModule } from '../database/database.module';
import { AmbienteModule } from '../ambiente/ambiente.module';
import { UsersModule } from '../users/users.module';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';
import { PrismaExpenseRepository } from './repositories/prisma-expense.repository';
import { EXPENSE_REPOSITORY } from './repositories/expense.repository';

@Module({
  imports: [DatabaseModule, AmbienteModule, UsersModule],
  controllers: [GastosController],
  providers: [
    GastosService,
    JwtAuthGuard,
    {
      provide: EXPENSE_REPOSITORY,
      useClass: PrismaExpenseRepository,
    },
  ],
  exports: [GastosService],
})
export class GastosModule {}
