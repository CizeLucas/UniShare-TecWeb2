import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AmbientService } from './ambient.service';
import { CreateAmbientDto } from './dto/create-ambient.dto';
import { UpdateAmbientDto } from './dto/update-ambient.dto';

@Controller('ambient')
export class AmbientController {
  constructor(private readonly ambientService: AmbientService) {}

  @Post()
  create(@Body() createAmbientDto: CreateAmbientDto) {
    return this.ambientService.create(createAmbientDto);
  }

  @Get()
  findAll() {
    return this.ambientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ambientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmbientDto: UpdateAmbientDto) {
    return this.ambientService.update(+id, updateAmbientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ambientService.remove(+id);
  }
}
