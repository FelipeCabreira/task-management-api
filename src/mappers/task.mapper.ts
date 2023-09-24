import { InvalidMapperData } from '@exceptions';
import { ColumnDocument, TaskDocument, UserDocument } from '@types-database';
import { ColumnTaskDTO, TaskDTO } from '@types-dto';
import { UserMapper } from './user.mapper';

export const TaskMapper = (data: TaskDocument): TaskDTO => {
  try {
    return {
      _id: data._id.toString(),
      title: data.title,
      description: data.description,
      author: UserMapper(data.author as UserDocument),
      // assignees: data?.assignees?.map(UserMapper),
      // tags: data.tags.map(TagMapper),
    };
  } catch (error) {
    throw new InvalidMapperData(`Invalid data from mapper: ${error}`);
  }
};

export const ColumnTaskMapper = (data: ColumnDocument): ColumnTaskDTO => {
  try {
    return {
      _id: data._id.toString(),
      name: data.name,
      // tasks: data.tasks.map(TaskMapper),
    } as ColumnTaskDTO;
  } catch (error) {
    throw new InvalidMapperData(`Invalid data from mapper: ${error}`);
  }
};
