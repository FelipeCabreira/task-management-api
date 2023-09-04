import { Inject, Service } from 'typedi';
import { NotFoundError } from 'routing-controllers';
import { BoardMapper } from '@mappers';
import { BoardDTO } from '@types-dto';
import 'reflect-metadata';
import { BoardRepository } from '@repository';

@Service()
export class BoardService {
  boardRepository: BoardRepository;

  constructor(@Inject() boardRepository: BoardRepository) {
    this.boardRepository = boardRepository;
  }

  async getBoard(boardId: string): Promise<BoardDTO | null> {
    const board = await this.boardRepository.getById(boardId);
    if (!board) {
      throw new NotFoundError('Board was not found');
    }
    return BoardMapper(board);
  }
}
