import { Service } from 'typedi';
import { GenericRepository } from './generic.repository';
import { boardModel } from '@models';
import { BoardDocument, BoardFields, ColumnDocument, IBoard } from '@types-database';
import { PaginatedResult, Pagination } from '@types';

@Service()
export class BoardRepository extends GenericRepository<IBoard, BoardDocument, BoardFields> {
  constructor() {
    super();
    this.fields = ['_id', 'name', 'description', 'columns', 'timeCreated'];
    this.model = boardModel;
  }

  async delete(boardId: string) {
    this.validateId(boardId);
    await super.delete(boardId);
  }

  async getAllBoards(settings: Pagination): Promise<PaginatedResult<BoardDocument>> {
    const totalCount = await this.model.count({});
    const data = (await this.model
      .find({}, this.fields.join(' '))
      .limit(settings.limit * 1)
      .skip((settings.page - 1) * settings.limit)) as BoardDocument[];

    return { data, totalCount };
  }

  async createColumn(boardId: string, columnName: string) {
    this.validateId(boardId);
    // const { columns } = ( await this.model.findOneAndUpdate)
    const columns = (await this.model.findOneAndUpdate(
      { _id: boardId },
      { $push: { columns: { name: columnName } } },
      { new: true },
    )) as ColumnDocument[];

    return columns.pop();
  }

  async deleteColumn(boardId: string, columnId: string) {
    this.validateId(boardId);
    this.validateId(columnId);
    return await this.model.findOneAndUpdate(
      { _id: boardId },
      { $pull: { columns: { _id: columnId } } },
    );
  }
}
