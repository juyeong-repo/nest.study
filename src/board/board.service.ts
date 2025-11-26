import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { BoardDatabase } from './database/board.database';

@Injectable()
export class BoardService {
  constructor(private readonly boardDatabase: BoardDatabase) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    // Get next_val
    const id = await this.boardDatabase.getNextId();
    const now = new Date();

    const board = new Board({
      id,
      ...createBoardDto,
      createdAt: now,
      updatedAt: now,
    });

    // 결국 typeORM, sql이랑 똑같음
    // return await this.boardDatabase.save(board);

    await this.boardDatabase.save(board);
  
    // 메타데이터 업데이트!
    await this.boardDatabase.updateTotalBoards();
    
  return board;

    
  }

  async findAll(): Promise<Board[]> {
    return await this.boardDatabase.findAll();
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.boardDatabase.findById(id);

    // exception 처리를 공통으로 빼는 방식 고민해보기.. 내가 정의하든가.
    // 어떤 코드가 가독성 좋은 코드인지, 예외처리는 어떻게 하는게 효율적인지에 대한 고민이 필요. 
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }


  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    // id로 조회
    const existingBoard = await this.findOne(id);

    // 
    const updatedBoard = new Board({
      ...existingBoard,
      ...updateBoardDto,
      updatedAt: new Date(),
    });

    const result = await this.boardDatabase.update(id, updatedBoard);

    if (!result) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return result;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.boardDatabase.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }
}
