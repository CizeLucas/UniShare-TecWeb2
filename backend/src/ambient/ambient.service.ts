import { Injectable } from '@nestjs/common';
import { CreateAmbientDto } from './dto/create-ambient.dto';
import { UpdateAmbientDto } from './dto/update-ambient.dto';

@Injectable()
export class AmbientService {
  create(createAmbientDto: CreateAmbientDto) {
    return 'This action adds a new ambient';
  }

  findAll() {
    return `This action returns all ambient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ambient`;
  }

  update(id: number, updateAmbientDto: UpdateAmbientDto) {
    return `This action updates a #${id} ambient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ambient`;
  }
}
