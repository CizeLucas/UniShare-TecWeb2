import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseModule } from '../database/database.module';
import { AmbienteController } from './ambiente.controller';
import { AmbienteService } from './ambiente.service';
import { PrismaAmbienteRepository } from './repositories/prisma-ambiente.repository';
import { AMBIENTE_REPOSITORY } from './repositories/ambiente.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AmbienteController],
  providers: [
    AmbienteService,
    JwtAuthGuard,
    {
      provide: AMBIENTE_REPOSITORY,
      useClass: PrismaAmbienteRepository,
    },
  ],
  exports: [AmbienteService],
})
export class AmbienteModule {}
