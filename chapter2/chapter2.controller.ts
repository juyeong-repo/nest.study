import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Chapter2Service } from './chapter2.service';
import { CreateChapter2Dto } from './dto/create-chapter2.dto';
import { UpdateChapter2Dto } from './dto/update-chapter2.dto';

@Controller('chapter2')
export class Chapter2Controller {
  constructor(private readonly chapter2Service: Chapter2Service) {}

  @Post()
  create(@Body() createChapter2Dto: CreateChapter2Dto) {
    return this.chapter2Service.create(createChapter2Dto);
  }

  @Get()
  findAll() {
    return this.chapter2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapter2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapter2Dto: UpdateChapter2Dto) {
    return this.chapter2Service.update(+id, updateChapter2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapter2Service.remove(+id);
  }
}
