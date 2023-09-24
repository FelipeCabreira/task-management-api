import { BoardService, UserService } from '@services';
import { Body, Controller, Delete, Param, Patch, Post, Put } from 'routing-controllers';
import Container from 'typedi';

@Controller('/boards/:boardId/columns')
export class ColumnController {
  userService: UserService;
  boardService: BoardService;

  constructor() {
    this.userService = Container.get(UserService);
    this.boardService = Container.get(BoardService);
  }

  @Post('/')
  async createColumn(@Param('boardId') boardId: string, @Body() columnData: { name: string }) {
    // fieldErrorsHandler(createColumnPayloadValidator(columnData));

    await this.boardService.getBoard(boardId);
    return this.boardService.createColumn(boardId, columnData.name);
  }

  // @Get('/:columnId')
  // async getColumn(){
  //   return this.boardService.
  // }

  @Put('/:columnId')
  async updateColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() columnData: { name: string },
  ) {
    // fieldErrorsHandler(updateColumnPayloadValidator(columnData));

    await this.boardService.updateColumn(boardId, columnId, columnData.name);
    return this.boardService.getBoard(boardId);
  }

  @Patch('/:columnId')
  async moveColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() columnData: { index: number },
  ) {
    // const { columns } = await this.boardService.getBoard(boardId);
    // const moveColumnPayloadValidator = validator(MoveColumnPayloadSchema(columns.length));
    // fieldErrorsHandler(moveColumnPayloadValidator(columnData));

    await this.boardService.updateColumnOrder(boardId, columnId, columnData.index);
    return this.boardService.getBoard(boardId);
  }

  @Delete('/:columnId')
  async deleteColumn(@Param('boardId') boardId: string, @Param('columnId') columnId: string) {
    await this.boardService.getBoard(boardId);
    await this.boardService.deleteColumn(boardId, columnId);
    return this.boardService.getBoard(boardId);
  }
}
