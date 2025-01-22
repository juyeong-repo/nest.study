import { Test, TestingModule } from '@nestjs/testing';
import { Chapter2Controller } from './chapter2.controller';
import { Chapter2Service } from './chapter2.service';

describe('Chapter2Controller', () => {
  let controller: Chapter2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Chapter2Controller],
      providers: [Chapter2Service],
    }).compile();

    controller = module.get<Chapter2Controller>(Chapter2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
