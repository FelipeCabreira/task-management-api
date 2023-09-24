import { BoardMapper, BoardSimpleViewMapper, ColumnSimpleMapper } from '@mappers';
import { BoardRepository } from '@repository';
import { BoardDocument, ColumnDocument } from '@types-database';
import { BoardDTO, BoardSimpleDTO, ColumnSimpleDTO } from '@types-dto';
import { Pagination } from '@types-utils';
import 'reflect-metadata';
import { NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class BoardService {
  boardRepository: BoardRepository;

  constructor(@Inject() boardRepository: BoardRepository) {
    this.boardRepository = boardRepository;
  }

  async getBoard(boardId: string): Promise<BoardDTO> {
    const board = await this.boardRepository.getById(boardId);
    if (!board) {
      throw new NotFoundError('Board was not found');
    }
    return BoardMapper(board);
  }

  async createBoard(board: any, userId?: string): Promise<BoardSimpleDTO> {
    // board.members = [{ user: userId, role: RoleNames.ADMIN }];
    const result = await this.boardRepository.create(board);
    return BoardSimpleViewMapper(result);
  }

  async getUserBoards(
    userId: string,
    options: Pagination,
  ): Promise<{ totalCount: number; boards: BoardSimpleDTO[] }> {
    const { totalCount, data } = await this.boardRepository.getUserBoards(userId, options);
    return {
      totalCount,
      boards: data.map(BoardSimpleViewMapper),
    };
  }

  async getBoards(options: Pagination): Promise<{ totalCount: number; boards: BoardSimpleDTO[] }> {
    const { totalCount, data } = await this.boardRepository.getAllBoards(options);
    return {
      totalCount,
      boards: data.map(BoardSimpleViewMapper) as BoardSimpleDTO[],
    };
  }

  async updateBoard(boardId: string, data: { name?: string; description?: string }) {
    const board = (await this.boardRepository.getById(boardId)) as BoardDocument;
    board.name = data.name ?? board.name;
    board.description = data.description ?? board.description;
    await this.boardRepository.save(board);
    return BoardSimpleViewMapper(board);
  }

  async deleteBoard(boardId: string): Promise<void> {
    await this.boardRepository.delete(boardId);
  }

  async createColumn(boardId: string, columnName: string): Promise<ColumnSimpleDTO> {
    const column = (await this.boardRepository.createColumn(boardId, columnName)) as ColumnDocument;
    return ColumnSimpleMapper(column) as ColumnSimpleDTO;
  }

  async updateColumn(boardId: string, columnId: string, name: string): Promise<void> {
    try {
      const board = await this.boardRepository.getById(boardId);
      const column = board?.columns.find((column) => column._id.equals(columnId));
      if (!board) {
        throw new NotFoundError(`board with given id: ${boardId} was not found`);
      }
      if (!column) {
        throw new NotFoundError(`column with given id: ${columnId} was not found`);
      }
      column.name = name;
      await this.boardRepository.save(board);
    } catch (error) {
      throw new NotFoundError(`Unable to update columns: ${error}`);
    }
  }

  async updateColumnOrder(boardId: string, columnId: string, tragetIndex: number): Promise<void> {
    try {
      const board = await this.boardRepository.getById(boardId);
      const columnIndex = board?.columns.findIndex((column) => column._id.equals(columnId));
      if (!board) {
        throw new NotFoundError(`board with given id: ${boardId} was not found`);
      }
      if (!columnIndex) {
        throw new NotFoundError(`column index with given id: ${columnId} was not found`);
      }

      if (columnIndex < 0) {
        throw new NotFoundError(`column with given id: ${columnId} was not found`);
      }
      const column = board.columns.splice(columnIndex, 1)[0];
      board.columns.splice(tragetIndex, 0, column);
      await this.boardRepository.save(board);
    } catch (error) {
      throw new NotFoundError(`Unable to update columns order: ${error}`);
    }
  }

  async deleteColumn(boardId: string, columnId: string): Promise<void> {
    try {
      const board = await this.boardRepository.getById(boardId);
      const columnIndex = board?.columns.findIndex((column) => column._id.equals(columnId));
      if (!board) {
        throw new NotFoundError(`board with given id: ${boardId} was not found`);
      }
      if (!columnIndex) {
        throw new NotFoundError(`column index with given id: ${columnId} was not found`);
      }
      if (columnIndex < 0) {
        throw new NotFoundError(`column with given id: ${columnId} was not found`);
      }
      await this.boardRepository.deleteColumn(boardId, columnId);
    } catch (error) {
      throw new NotFoundError(`Unable to delete column: ${error}`);
    }
  }
}
