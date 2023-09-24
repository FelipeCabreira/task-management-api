import { InvalidMongooseIdError } from '@exceptions';
import { boardModel, taskModel } from '@models';
import {
  BoardDocument,
  BoardModel,
  ColumnDocument,
  ITask,
  TaskDocument,
  TaskFields,
  UserFields,
} from '@types-database';
import { Service } from 'typedi';
import { GenericRepository } from './generic.repository';

@Service()
export class TaskRepository extends GenericRepository<ITask, TaskDocument, TaskFields> {
  private boardModel: BoardModel;
  private userFields: UserFields[];
  // private tagFields: TagFields[];

  constructor() {
    super();
    this.fields = ['_id', 'title', 'description', 'author', 'board', 'assignees', 'tags'];
    this.userFields = ['_id', 'username', 'avatarImageURL', 'name', 'surname', 'email'];
    // this.tagFields = ["_id", "key", "name"];
    this.model = taskModel;
    this.boardModel = boardModel;
  }

  async addTaskToColumn(
    taskId: string,
    boardId: string,
    columnId: string,
    index: number,
  ): Promise<BoardDocument> {
    const board = await this.boardModel.findById(boardId);
    const task = await this.model.findById(taskId);
    const column = board?.columns.find((column) => column._id.equals(columnId)) as any;

    if (isNaN(index)) {
      column?.tasks.push(task);
    } else {
      column?.tasks.splice(index, 0, task);
    }
    return (await board?.save()) as BoardDocument;
  }

  async removeTaskFromColumn(
    taskId: string,
    boardId: string,
    columnId: string,
  ): Promise<BoardDocument> {
    const board = await this.boardModel.findById(boardId);
    const column = board?.columns.find((column) => column._id.equals(columnId)) as any;
    try {
      if (column !== undefined && column.tasks !== undefined) {
        column.tasks = column?.tasks.filter((task: any) => !task?._id.equals(taskId));
      }
    } catch (error) {
      throw new InvalidMongooseIdError(
        'Unable to remove task from columns - Columns undefined or task undefined',
      );
    }
    return (await board?.save()) as BoardDocument;
  }

  async removeTaskFromBoard(taskId: string, boardId: string): Promise<void> {
    await boardModel.findOneAndUpdate(
      { _id: boardId, columns: { $elemMatch: { tasks: taskId } } },
      { $pull: { 'columns.$.tasks': taskId } },
    );
  }

  async getBoardTasks(boardId: string): Promise<ColumnDocument[]> {
    const board = await this.boardModel.findById(boardId).populate({
      path: 'columns',
      populate: {
        path: 'tasks',
        select: this.fields.join(' '),
        // populate: {
        //   path: 'author assignees tags',
        //   select: this.userFields.join(' ') + this.tagFields.join(' '),
        // },
      },
    });
    return board?.columns as ColumnDocument[];
  }

  async getById(id: string): Promise<TaskDocument> {
    this.validateId(id);
    return (await this.model
      .findById(id, this.fields.join(' '))
      .populate({
        path: 'author',
        select: this.userFields.join(' '),
      })
      .populate({
        path: 'assignees',
        select: this.userFields.join(' '),
      })) as TaskDocument;
    // .populate({
    //   path: 'tags',
    //   select: this.tagFields.join(' '),
    // });
  }

  async addTaskAssignee(taskId: string, userId: string) {
    this.validateId(taskId);
    this.validateId(userId);

    await this.model.findOneAndUpdate({ _id: taskId }, { $push: { assignees: userId } });
  }

  async removeTaskAssignee(taskId: string, userId: string) {
    this.validateId(taskId);
    this.validateId(userId);

    await this.model.findOneAndUpdate({ _id: taskId }, { $pull: { assignees: userId } });
  }

  async addTaskTag(taskId: string, tagsId: string) {
    this.validateId(taskId);
    this.validateId(tagsId);

    await this.model.findOneAndUpdate({ _id: taskId }, { $push: { tags: tagsId } });
  }

  async removeTaskTag(taskId: string, tagsId: string) {
    this.validateId(taskId);
    this.validateId(tagsId);

    await this.model.findOneAndUpdate({ _id: taskId }, { $pull: { tags: tagsId } });
  }
}
