import { Test, TestingModule } from '@nestjs/testing';
import { Chapter2Service } from './chapter2.service';

describe('Chapter2Service', () => {
  let service: Chapter2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Chapter2Service],
    }).compile();

    service = module.get<Chapter2Service>(Chapter2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
