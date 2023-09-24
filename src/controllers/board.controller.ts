import { fieldErrorsHandler, getPaginationSettings } from '@lib-utils';
import { BoardService } from '@services';
import { CreateBoardPayload, UpdateBoardPayload } from '@types-request';
import { Pagination } from '@types-utils';
import { boardPayloadValidator } from '@validators';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParams } from 'routing-controllers';
import Container from 'typedi';

@Controller('/board')
export class BoardController {
  boardService: BoardService;

  constructor() {
    this.boardService = Container.get(BoardService);
  }

  @Post('/')
  createBoard(@Body() board: CreateBoardPayload) {
    fieldErrorsHandler(boardPayloadValidator(board));

    return this.boardService.createBoard(board);
  }
  // createBoard(@Body() board: CreateBoardPayload, @CurrentUser() user?: AuthUser) {
  //   fieldErrorsHandler(boardPayloadValidator(board));

  //   if (user) {
  //     return this.boardService.createBoard(board, user.id.toString());
  //   } else {
  //     return this.boardService.createBoard(board);
  //   }
  // }

  @Get('/')
  getBoards(@QueryParams() query: Pagination) {
    const options = getPaginationSettings(query);
    return this.boardService.getBoards(options);
  }

  @Get('/:boardId')
  async getBoard(@Param('boardId') boardId: string) {
    const board = await this.boardService.getBoard(boardId);
    return board;
  }

  @Delete('/:boardId')
  async deleteBoard(@Param('boardId') boardId: string) {
    //TODO: when have members added to board
    // const board = await this.boardService.deleteBoard(boardId);
    // return board;

    // const { name } = await this.boardService.getBoard(boardId);
    // const members = await this.memberService.getBoardMembers(boardId);

    // const notification = {
    //   title: "Board has been deleted",
    //   description: `Board "${name}" has been deleted `,
    //   key: "board.deleted",
    //   attributes: {
    //     boardId,
    //   },
    // };
    // const memberMessages = members.map(({ user }) => this.userService.addUserNotifications(user._id, notification));

    try {
      await this.boardService.deleteBoard(boardId);
      // await Promise.all(memberMessages);
    } catch (error) {
      throw error;
    }

    return { message: 'Board was successfully deleted' };
  }

  @Put('/:boardId')
  async updateBoard(@Param('boardId') boardId: string, @Body() payload: UpdateBoardPayload) {
    // fieldErrorsHandler(updateBoardPayloadValidator(payload));

    await this.boardService.getBoard(boardId);
    return await this.boardService.updateBoard(boardId, payload);
  }
}
