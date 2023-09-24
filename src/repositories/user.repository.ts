import { userModel } from '@models';
import {
  BoardFields,
  IUser,
  UserDocument,
  UserFields,
  UserNotificationFields,
} from '@types-database';
import { PaginatedResult, Pagination } from '@types-utils';
import { Service } from 'typedi';
import { GenericRepository } from './generic.repository';

@Service()
export class UserRepository extends GenericRepository<IUser, UserDocument, UserFields> {
  private boardFields: BoardFields[];
  private notificationFields: UserNotificationFields[];

  constructor() {
    super();
    this.fields = ['_id', 'username', 'email', 'name', 'surname', 'avatarImageURL', 'password'];
    this.notificationFields = ['_id', 'notifications'];
    this.model = userModel;
    this.boardFields = ['_id', 'name', 'description', 'columns', 'timeCreated'];
  }

  async getAllUser(settings: Pagination): Promise<PaginatedResult<UserDocument>> {
    const totalCount = await this.model.count({});
    const data = (await this.model
      .find({}, this.fields.join(' '))
      .limit(settings.limit * 1)
      .skip((settings.page - 1) * settings.limit)) as UserDocument[];

    return { data, totalCount };
  }

  async getUserByUsername(username: string): Promise<UserDocument> {
    return (await this.model.findOne({ username }, this.fields.join(' '))) as UserDocument;
  }

  async updateUser(userId: string, newValues: Partial<IUser>): Promise<UserDocument> {
    return (await this.model.findOneAndUpdate(
      { _id: userId },
      { ...newValues },
      { runValidators: true, context: 'query' },
    )) as UserDocument;
  }
}
