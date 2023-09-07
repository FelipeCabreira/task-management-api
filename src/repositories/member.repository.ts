import { Service } from 'typedi';
import { GenericRepository } from './generic.repository';
import {
  BoardDocument,
  BoardFields,
  BoardMember,
  IBoard,
  UserFields,
  UserModel,
} from '@types-database';
import { boardModel, userModel } from '@models';

@Service()
export class MemberRepository extends GenericRepository<IBoard, BoardDocument, BoardFields> {
  private userModel: UserModel;
  private userFields: UserFields[];

  constructor() {
    super();
    this.fields = ['_id', 'members'];
    this.userFields = ['_id', 'username', 'avatarImageURL', 'name', 'surname', 'email'];
    this.model = boardModel;
    this.userModel = userModel;
  }

  async getBoardMembers(boarId: string): Promise<BoardMember[]> {
    this.validateId(boarId);

    const { members }: any = await this.model
      .findById(boarId, '_id members')
      .populate({ path: 'members', populate: { path: 'user', select: this.userFields.join(' ') } });
    return members;
  }

  async getBoardMember(boardId: string, userId: string): Promise<BoardMember> {
    this.validateId(boardId);
    this.validateId(userId);

    const { members }: any = await this.model
      .findById(boardId, '_id members')
      .populate({ path: 'members', populate: { path: 'user', select: this.userFields.join(' ') } });
    return members.find((member: any) => (member as any)?.user._id.equals(userId));
  }

  async addUserToBoard(boardId: string, userId: string): Promise<BoardMember> {
    this.validateId(boardId);
    this.validateId(userId);

    const user = await this.userModel.findById(userId);
    const { members }: any = this.model
      .findOneAndUpdate({ _id: boardId }, { $push: { members: { user } } }, { new: true })
      .populate({ path: 'members', populate: { path: 'user', select: this.userFields.join(' ') } });
    return members.find((member: any) => (member as any)?.user._id.equals(userId));
  }

  async removeUserFromBoard(boardId: string, userId: string): Promise<void> {
    this.validateId(boardId);
    this.validateId(userId);

    const user = await this.userModel.findById(userId);
    await this.model.findOneAndUpdate(
      { _id: boardId },
      { $pull: { members: { user } } },
      { new: true },
    );
  }

  // async updateBoardMemberRole(
  //   boardId: string,
  //   userId: string,
  //   role: RoleNames,
  // ): Promise<BoardMember> {
  //   this.validateId(boardId);
  //   this.validateId(userId);

  //   const { members } = await this.model
  //     .findOneAndUpdate(
  //       { _id: boardId, 'members.user': userId },
  //       { $set: { 'members.$.role': role } },
  //       { new: true },
  //     )
  //     .populate({ path: 'members', populate: { path: 'user', select: this.userFields.join(' ') } });
  //   return members.find((member) => (member as any)?.user._id.equals(userId));
  // }
}
