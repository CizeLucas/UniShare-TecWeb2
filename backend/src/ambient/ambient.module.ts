import { Module } from '@nestjs/common';
import { AmbientService } from './ambient.service';
import { AmbientController } from './ambient.controller';

@Module({
  controllers: [AmbientController],
  providers: [AmbientService],
})
export class AmbientModule {}
