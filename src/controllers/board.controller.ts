import { BoardService } from '@services';
import Container from 'typedi';
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Controller,
  QueryParams,
  UseBefore,
  CurrentUser,
  Authorized,
} from 'routing-controllers';
import { CreateBoardPayload } from '@types-request';

@Controller('/board')
export class BoardController {
  boardService: BoardService;

  constructor() {
    this.boardService = Container.get(BoardService);
  }

  @Post('/')
  createBoard(@Body() board: CreateBoardPayload) {
    // fieldErrorsHandler(boardPayloadValidator(board));

    return this.boardService;
  }
}
