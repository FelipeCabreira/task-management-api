import { MemberMapper } from '@mappers';
import { MemberRepository } from '@repository';
import { MemberDTO } from '@types-dto';
import { UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class MemberService {
  memberRepository: MemberRepository;

  constructor(@Inject() memberRepository: MemberRepository) {
    this.memberRepository = memberRepository;
  }

  async getBoardMembers(boardId: string): Promise<MemberDTO[]> {
    const members = await this.memberRepository.getBoardMembers(boardId);
    return members.map(MemberMapper);
  }

  async getBoardMember(boardId: string, userId: string): Promise<MemberDTO> {
    const member = await this.memberRepository.getBoardMember(boardId, userId);
    if (!member) {
      throw new UnauthorizedError('User is not a member of the board');
    }
    return MemberMapper(member);
  }

  async isUserBoardMember(boardId: string, userId: string): Promise<boolean> {
    try {
      await this.getBoardMember(boardId, userId);
      return true;
    } catch (error) {
      return false;
    }
  }

  async addUserToBoard(boardId: string, userId: string): Promise<MemberDTO> {
    const member = await this.memberRepository.addUserToBoard(boardId, userId);
    return MemberMapper(member);
  }

  async removeUserFromBoard(boardId: string, userId: string): Promise<void> {
    await this.memberRepository.removeUserFromBoard(boardId, userId);
  }

  // async updateBoardMemberRole(boardId: string, userId: string, role: RoleNames): Promise<MemberDTO> {
  //   const member = await this.memberRepository.updateBoardMemberRole(boardId, userId, role);
  //   return MemberMapper(member);
  // }
}
