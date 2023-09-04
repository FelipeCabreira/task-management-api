import { BoardDocument, ColumnDocument } from '@types-database';
import { BoardDTO, BoardSimpleDTO, ColumnSimpleDTO } from '@types-dto';

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

export const BoardSimpleViewMapper = (data: BoardDocument): BoardSimpleDTO | null => {
  if (!data) {
    return null;
  }
  return {
    _id: data._id.toString(),
    timeCreated: data.timeCreated,
    name: data.name,
    description: data.description,
  };
};

export const ColumnSimpleMapper = (data: ColumnDocument): ColumnSimpleDTO | null => {
  if (!data) {
    return null;
  }
  return {
    _id: data._id.toString(),
    name: data.name,
  };
};
