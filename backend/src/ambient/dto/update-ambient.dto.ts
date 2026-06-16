import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbientDto } from './create-ambient.dto';

export class UpdateAmbientDto extends PartialType(CreateAmbientDto) {}
