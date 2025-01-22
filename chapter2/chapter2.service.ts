import { Injectable } from '@nestjs/common';
import { CreateChapter2Dto } from './dto/create-chapter2.dto';
import { UpdateChapter2Dto } from './dto/update-chapter2.dto';

@Injectable()
export class Chapter2Service {
  create(createChapter2Dto: CreateChapter2Dto) {
    return 'This action adds a new chapter2';
  }

  findAll() {
    return `This action returns all chapter2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chapter2`;
  }

  update(id: number, updateChapter2Dto: UpdateChapter2Dto) {
    return `This action updates a #${id} chapter2`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapter2`;
  }
}
