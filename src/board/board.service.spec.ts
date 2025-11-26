import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDatabase } from './database/board.database';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

// board 서비스 가져와서
describe('BoardService', () => {
  let service: BoardService;
  let database: BoardDatabase;

  // 테스트전에 환경설정
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardService, BoardDatabase],
    }).compile();

    service = module.get<BoardService>(BoardService);
    database = module.get<BoardDatabase>(BoardDatabase);

    await database.clear();
  });

  // 
  afterEach(async () => {
    await database.clear();
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
      };

      const result = await service.create(createBoardDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe(createBoardDto.title);
      expect(result.content).toBe(createBoardDto.content);
      expect(result.author).toBe(createBoardDto.author);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    // it: 하나의 테스트케이스 
    it('should auto-increment ID for multiple boards', async () => {
      const dto1: CreateBoardDto = {
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      };
      const dto2: CreateBoardDto = {
        title: 'Title 2',
        content: 'Content 2',
        author: 'Author 2',
      };
      // const dto3: CreateBoardDto = {
      //   title: 'Title 3',
      //   content: 'Content 3',
      //   author: 'Author 3',
      // };

      const board1 = await service.create(dto1);
      const board2 = await service.create(dto2);
      // expect 기대값 확인
      expect(board1.id).toBe(1);
      expect(board2.id).toBe(2);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no boards exist', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all boards', async () => {
      const dto1: CreateBoardDto = {
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      };
      const dto2: CreateBoardDto = {
        title: 'Title 2',
        content: 'Content 2',
        author: 'Author 2',
      };

      await service.create(dto1);
      await service.create(dto2);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Title 1');
      expect(result[1].title).toBe('Title 2');
    });
  });

  describe('findOne', () => {
    it('should return a board by ID', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
      };

      const created = await service.create(createBoardDto);
      const result = await service.findOne(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.title).toBe(createBoardDto.title);
    });

    it('should throw NotFoundException when board does not exist', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Board with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'Original Title',
        content: 'Original Content',
        author: 'Original Author',
      };

      const created = await service.create(createBoardDto);
      const originalUpdatedAt = created.updatedAt;

      const updateBoardDto: UpdateBoardDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const result = await service.update(created.id, updateBoardDto);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe('Updated Title');
      expect(result.content).toBe('Updated Content');
      expect(result.author).toBe('Original Author');
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when updating non-existent board', async () => {
      const updateBoardDto: UpdateBoardDto = {
        title: 'Updated Title',
      };

      await expect(service.update(999, updateBoardDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a board', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
      };

      const created = await service.create(createBoardDto);
      await service.remove(created.id);

      await expect(service.findOne(created.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent board', async () => {
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
