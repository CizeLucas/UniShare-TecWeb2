import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AmbientModule } from './ambient/ambient.module';

@Module({
  imports: [UserModule, AmbientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
