import { BoardDocument } from '@types/database';
import { BoardDTO } from '@types/dto';

export const BoardMapper = (data: BoardDocument): BoardDTO | null => {
  if (!data) {
    return null;
  }
  return {
    _id: data._id.toString(),
    timeCreated: data.timeCreated,
    name: data.name,
    description: data.description,
    columns: data.columns.map(({ _id, name }) => ({ _id: _id.toString(), name })),
  };
};
