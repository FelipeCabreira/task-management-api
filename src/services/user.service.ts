import { UserMapper } from '@mappers';
import { BoardRepository, UserRepository } from '@repository';
import { Pagination } from '@types';
import { IUser } from '@types-database';
import { UserDTO } from '@types-dto';
import { UpdateUserPayload } from '@types-request';
import { NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class UserService {
  userRepository: UserRepository;
  boardRepository: BoardRepository;

  constructor(
    @Inject() userRepository: UserRepository,
    @Inject() boardRepository: BoardRepository,
  ) {
    this.userRepository = userRepository;
    this.boardRepository = boardRepository;
  }

  async getUser(userId: string): Promise<UserDTO | null> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError('User was not found');
    }
    return UserMapper(user);
  }

  async getAllUsers(options: Pagination): Promise<{ totalCount: number; users: UserDTO[] | null } |> {
    const { data, totalCount } = await this.userRepository.getAllUser(options);
    return {
      totalCount,
      users: data.map(UserMapper),
    };
  }

  async updateUser(userId: string, userData: UpdateUserPayload): Promise<UserDTO | null> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError('User was not found.');
    }
    user.name = userData.name ?? user.name;
    user.surname = userData.surname ?? user.surname;
    user.email = userData.email ?? user.email;
    await this.userRepository.save(user);
    return UserMapper(user);
  }

  async updateUserInfo(userId: string, userData: IUser): Promise<UserDTO | null> {
    const user = await this.userRepository.updateUser(userId, userData);
    return UserMapper(user);
  }
}
