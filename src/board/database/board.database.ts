import { Injectable } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardDatabase {
  // file db 선언
  private db: JsonDB;

  // 생성자
  constructor() {
    // 'boardDB.json' 파일을 만들어서 데이터베이스로 사용
    this.db = new JsonDB(new Config('boardDB', true, false, '/'));
    this.initDatabase();
  }

  // JSON 파일 안에 기본 구조 생성
  private async initDatabase() {
    try {
      const boards = await this.db.getData('/boards');
      if (!Array.isArray(boards)) {
       // boards 배열이 없으면 빈 배열로 초기화
        await this.db.push('/boards', [], true);
      }
    } catch (error) {
      // nextId가 없으면 1로 초기화
      await this.db.push('/boards', [], true);
    }

    try {
      await this.db.getData('/nextId');
    } catch (error) {
      // 에러 발생하면 /nextId 에 push
      await this.db.push('/nextId', 1, true);
    }
  }

  // 각 함수들이 sql 쿼리 역할
  async getNextId(): Promise<number> {
    try {
      const currentId = await this.db.getData('/nextId');
      await this.db.push('/nextId', currentId + 1, true);
      return currentId;
    } catch (error) {
      await this.db.push('/nextId', 2, true);
      return 1;
    }
  }

  async findAll(): Promise<Board[]> {
    try {
      const data = await this.db.getData('/boards');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  async findById(id: number): Promise<Board | undefined> {
    const boards = await this.findAll();
    return boards.find((board) => board.id === id);
  }

  async save(board: Board): Promise<Board> {
    const boards = await this.findAll();
    boards.push(board);
    await this.db.push('/boards', boards, true);
    return board;
  }

  async update(id: number, updatedBoard: Board): Promise<Board | undefined> {
    const boards = await this.findAll();
    const index = boards.findIndex((board) => board.id === id);

    if (index === -1) {
      return undefined;
    }

    boards[index] = updatedBoard;
    await this.db.push('/boards', boards, true);
    return updatedBoard;
  }

  async delete(id: number): Promise<boolean> {
    const boards = await this.findAll();
    const index = boards.findIndex((board) => board.id === id);

    if (index === -1) {
      return false;
    }

    boards.splice(index, 1);
    await this.db.push('/boards', boards, true);
    return true;
  }

  async clear(): Promise<void> {
    await this.db.push('/boards', [], true);
    await this.db.push('/nextId', 1, true);
  }
}
