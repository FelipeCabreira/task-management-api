import { UserDocument } from '@types-database';
import { UserDTO } from '@types-dto';

export const UserMapper = (data: UserDocument): UserDTO | null => {
  if (!data) {
    return null;
  }

  return {
    _id: data._id.toString(),
    username: data.username,
    name: data.name,
    surname: data.surname,
    email: data.email,
    avatarImageURL: data.avatarImageURL,
  };
};
