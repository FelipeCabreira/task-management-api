import { validator } from '@core-utils';
import { fieldErrorsHandler } from '@lib-utils';
import { BoardService, MemberService, UserService } from '@services';
import { GetColumnTasksQueryParams } from '@types-queryparams';
import { CreateTaskPayload, MoveTaskPayload, UpdateTaskPayload } from '@types-request';
import {
  MoveTaskIndexPayloadSchema,
  createTaskPayloadValidator,
  moveTaskPayloadValidator,
  updateTaskPayloadValidator,
} from '@validators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpError,
  Param,
  Patch,
  Post,
  Put,
  QueryParams,
} from 'routing-controllers';
import { TaskService } from 'src/services/task.service';
import Container from 'typedi';

@Controller('/tasks')
export class TaskController {
  taskService: TaskService;
  // tagService: TagService;
  memberService: MemberService;
  boardService: BoardService;
  userService: UserService;

  constructor() {
    this.taskService = Container.get(TaskService);
    this.memberService = Container.get(MemberService);
    // this.tagService = Container.get(TagService);
    this.boardService = Container.get(BoardService);
    this.userService = Container.get(UserService);
  }

  @Get('/')
  async getColumnTasks(@QueryParams() query: GetColumnTasksQueryParams) {
    if (!query.boardId) {
      throw new HttpError(400, 'query parameter boardId is required');
    }
    await this.boardService.getBoard(query.boardId);
    if (query.columnId) {
      return this.taskService.getColumnTasks(query.boardId, query.columnId);
    }
    return this.taskService.getAllColumnTasks(query.boardId);
  }

  @Post('/')
  async createTask(@Body() payload: CreateTaskPayload) {
    // @CurrentUser() user: AuthUser
    fieldErrorsHandler(createTaskPayloadValidator(payload));
    const { boardId, columnId, ...taskData } = payload;

    await this.boardService.getBoard(boardId);
    // const task = await this.taskService.createTask(taskData, boardId, user.id.toString());
    const task = await this.taskService.createTask(taskData, boardId);
    await this.taskService.addTaskToColumn(boardId, columnId, task._id.toString());
    return task;
  }

  @Get('/:taskId')
  getTask(@Param('taskId') taskId: string) {
    return this.taskService.getTask(taskId);
  }

  @Put('/:taskId')
  async updateTask(@Param('taskId') taskId: string, @Body() payload: UpdateTaskPayload) {
    fieldErrorsHandler(updateTaskPayloadValidator(payload));
    return this.taskService.updateTask(taskId, payload);
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    const { assignees, title } = await this.taskService.getTask(taskId);
    const boardId = await this.taskService.getTaskBoardId(taskId);

    const notification = {
      title: 'Task has been deleted',
      description: `Task "${title}" which you were assigned to was deleted `,
      key: 'task.deleted',
      attributes: {
        taskId,
        boardId,
      },
    };
    // const assigneesMessages = assignees.map((assignee) =>
    //   this.userService.addUserNotifications(assignee._id, notification),
    // );

    try {
      await this.taskService.deleteTask(taskId);
      // await Promise.all(assigneesMessages);
    } catch (error) {
      throw error;
    }

    return { message: 'Deleted task successfully' };
  }

  @Patch('/:taskId/move')
  async moveTask(@Param('taskId') taskId: string, @Body() payload: MoveTaskPayload) {
    fieldErrorsHandler(moveTaskPayloadValidator(payload));
    const { boardId, columnId, rowIndex } = payload;

    const { tasks } = await this.taskService.getColumnTasks(boardId, columnId);
    const moveTaskIndexPayloadValidator = validator(MoveTaskIndexPayloadSchema(tasks.length));
    fieldErrorsHandler(moveTaskIndexPayloadValidator({ rowIndex }));

    await this.taskService.getTask(taskId);
    await this.taskService.moveTaskToColumn(taskId, boardId, columnId, rowIndex);
    return this.taskService.getColumnTasks(boardId, columnId);
  }

  // @Patch('/:taskId/tags/:tagId')
  // async addTag(
  //   @Param('taskId') taskId: string,
  //   @Param('tagId') tagId: string,
  // ): Promise<{ message: string }> {
  //   const boardId = await this.taskService.getTaskBoardId(taskId);
  //   const tags = await this.tagService.getBoardTags(boardId);
  //   const tag = tags.find(({ _id }) => _id == tagId);
  //   if (!tag) {
  //     throw new NotFoundError('Tag does not exist on the board');
  //   }
  //   await this.taskService.addTagToTask(taskId, tagId);
  //   return { message: 'Tag added to the task' };
  // }

  // @Delete('/:taskId/tags/:tagId')
  // async removeTag(
  //   @Param('taskId') taskId: string,
  //   @Param('tagId') tagId: string,
  // ): Promise<{ message: string }> {
  //   const boardId = await this.taskService.getTaskBoardId(taskId);
  //   const tags = await this.tagService.getBoardTags(boardId);
  //   const tag = tags.find(({ _id }) => _id == tagId);
  //   if (!tag) {
  //     throw new NotFoundError('Tag does not exist on the board');
  //   }
  //   await this.taskService.removeTagFromTask(taskId, tagId);
  //   return { message: 'Tag removed from the task' };
  // }

  // @Patch('/:taskId/assignees/:userId')
  // async addAssignee(
  //   @Param('taskId') taskId: string,
  //   @Param('userId') userId: string,
  // ): Promise<{ message: string }> {
  //   const { title } = await this.taskService.getTask(taskId);
  //   const boardId = await this.taskService.getTaskBoardId(taskId);

  //   const notification = {
  //     title: 'Assigned to task',
  //     description: `You have been assigned to task "${title}"`,
  //     key: 'task.assignee.added',
  //     attributes: {
  //       taskId,
  //       boardId,
  //     },
  //   };

  //   try {
  //     await this.taskService.addAssigneeToTask(taskId, userId);
  //     // await this.userService.addUserNotifications(userId, notification);
  //   } catch (error) {
  //     throw error;
  //   }

  //   return { message: 'Assignee added to the task' };
  // }

  // @Delete('/:taskId/assignees/:userId')
  // async removeAssignee(
  //   @Param('taskId') taskId: string,
  //   @Param('userId') userId: string,
  // ): Promise<{ message: string }> {
  //   const boardId = await this.taskService.getTaskBoardId(taskId);
  //   await this.memberService.getBoardMember(boardId, userId);
  //   await this.taskService.removeAssigneeFromTask(taskId, userId);
  //   return { message: 'Assignee removed from the task' };
  // }
}
