import { BoardService, MemberService, UserService } from '@services';
import { Controller, Delete, Get, HttpError, Param, Post } from 'routing-controllers';
import Container from 'typedi';

@Controller('/boards/:boardId/members')
export class MemberController {
  memberService: MemberService;
  boardService: BoardService;
  userService: UserService;

  constructor() {
    this.memberService = Container.get(MemberService);
    this.boardService = Container.get(BoardService);
    this.userService = Container.get(UserService);
  }

  @Get('/')
  async getBoardMembers(@Param('boardId') boardId: string) {
    await this.boardService.getBoard(boardId);
    return this.memberService.getBoardMembers(boardId);
  }

  @Get('/:userId')
  async getBoardMember(@Param('boardId') boardId: string, @Param('userId') userId: string) {
    await this.boardService.getBoard(boardId);
    await this.userService.getUser(userId);
    return this.memberService.getBoardMember(boardId, userId);
  }

  @Post('/:userId')
  async addUserToBoard(@Param('boardId') boardId: string, @Param('userId') userId: string) {
    const { name }: any = await this.boardService.getBoard(boardId);
    await this.userService.getUser(userId);

    const isBoardMember = await this.memberService.isUserBoardMember(boardId, userId);

    if (isBoardMember) {
      throw new HttpError(400, 'User is already a member of the board');
    } else {
      await this.memberService.addUserToBoard(boardId, userId);
      const notification = {
        title: 'Added to the board',
        description: `You were added to the board "${name}"`,
        key: 'board.user.added',
        attributes: {
          boardId,
        },
      };
      // await this.userService.addUserNotifications(userId, notification);
    }

    return { message: 'User added to the board' };
  }

  @Delete('/:userId')
  async RemoveUserToBoard(@Param('boardId') boardId: string, @Param('userId') userId: string) {
    const { name }: any = await this.boardService.getBoard(boardId);
    await this.userService.getUser(userId);
    await this.memberService.getBoardMember(boardId, userId);

    await this.memberService.removeUserFromBoard(boardId, userId);
    const notification = {
      title: 'Removed from the board',
      description: `You were removed from the board "${name}"`,
      key: 'board.user.removed',
      attributes: {
        boardId,
      },
    };
    // await this.userService.addUserNotifications(userId, notification);

    return { message: 'User removed from the board' };
  }

  // @Patch("/:userId/role")
  // @Authorized(Permissions.ROLE_MODIFY)
  // async updateBoardMemberRole(
  //   @Param("boardId") boardId: string,
  //   @Param("userId") userId: string,
  //   @Body() payload: UpdateMemberRolePayload,
  // ) {
  //   const { name } = await this.boardService.getBoard(boardId);
  //   await this.userService.getUser(userId);

  //   fieldErrorsHandler(memberRolePayloadValidator(payload));
  //   const { role } = payload;
  //   const notification = {
  //     title: "User role modified",
  //     description: `You role on board "${name}" was modified to ${role}`,
  //     key: "board.user.role",
  //     attributes: {
  //       boardId,
  //       role,
  //     },
  //   };
  //   await this.userService.addUserNotifications(userId, notification);

  //   return this.memberService.updateBoardMemberRole(boardId, userId, role);
  // }
}
