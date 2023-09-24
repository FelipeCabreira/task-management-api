import { getPaginationSettings } from '@lib-utils';
import { BoardService, UserService } from '@services';
import { UserListQueryParams } from '@types-queryparams';
import { Pagination } from '@types-utils';
import { Controller, Get, Param, QueryParams } from 'routing-controllers';
import Container from 'typedi';

@Controller('/users')
export class UserController {
  userService: UserService;
  boardService: BoardService;

  constructor() {
    this.userService = Container.get(UserService);
    this.boardService = Container.get(BoardService);
  }

  @Get('/')
  getUsers(@QueryParams() query: UserListQueryParams) {
    const options = getPaginationSettings(query);
    if (query.username) {
      // return this.userService.getUsersByMatchUsername(query.username, options);
    } else {
      return this.userService.getAllUsers(options);
    }
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Get('/:userId/boards')
  async userBoards(@Param('userId') userId: string, @QueryParams() query: Pagination) {
    const options = getPaginationSettings(query);
    return this.boardService.getUserBoards(userId, options);
  }
}
