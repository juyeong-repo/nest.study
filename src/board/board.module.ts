import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardDatabase } from './database/board.database';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardDatabase],
})
export class BoardModule {}
