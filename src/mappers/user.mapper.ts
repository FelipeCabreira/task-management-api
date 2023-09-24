import { InvalidMapperData } from '@exceptions';
import { UserDocument } from '@types-database';
import { UserDTO } from '@types-dto';

export const UserMapper = (data: UserDocument): UserDTO => {
  try {
    return {
      _id: data._id.toString(),
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email,
      avatarImageURL: data.avatarImageURL,
    };
  } catch (error) {
    throw new InvalidMapperData(`Invalid data from mapper: ${error}`);
  }
};
