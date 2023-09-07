import { BoardMember, UserDocument } from '@types-database';
import { MemberDTO } from '@types-dto';
import { UserMapper } from './user.mapper';

export const MemberMapper = (data: BoardMember): MemberDTO => {
  // if (!data) return null;

  return {
    // role: data.role
    user: UserMapper(data.user as UserDocument),
  };
};
