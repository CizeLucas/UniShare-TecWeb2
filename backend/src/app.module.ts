import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AmbienteModule } from './ambiente/ambiente.module';
import { GastosModule } from './gastos/gastos.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, AmbienteModule, GastosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
