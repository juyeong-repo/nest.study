import { Module } from '@nestjs/common';
import { Chapter2Service } from './chapter2.service';
import { Chapter2Controller } from './chapter2.controller';

@Module({
  controllers: [Chapter2Controller],
  providers: [Chapter2Service],
})
export class Chapter2Module {}
