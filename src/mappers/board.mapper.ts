import { BoardDocument, ColumnDocument } from '@types-database';
import { BoardDTO, BoardSimpleDTO, ColumnSimpleDTO } from '@types-dto';
import { NotFoundError } from 'routing-controllers';

export const BoardMapper = (data: BoardDocument): BoardDTO => {
  try {
    return {
      _id: data._id.toString(),
      timeCreated: data.timeCreated,
      name: data.name,
      description: data.description,
      columns: data.columns.map(({ _id, name }) => ({ _id: _id.toString(), name })),
    };
  } catch (error) {
    throw new NotFoundError(`Board DTO for ${data} not found, error: ${error}`);
  }
};

export const BoardSimpleViewMapper = (data: BoardDocument): BoardSimpleDTO => {
  try {
    return {
      _id: data._id.toString(),
      timeCreated: data.timeCreated,
      name: data.name,
      description: data.description,
    };
  } catch (error) {
    throw new NotFoundError(`Board Simple DTO for ${data} not found, error: ${error}`);
  }
};

export const ColumnSimpleMapper = (data: ColumnDocument): ColumnSimpleDTO => {
  try {
    return {
      _id: data._id.toString(),
      name: data.name,
    };
  } catch (error) {
    throw new NotFoundError(`Column Simple DTO for ${data} not found, error: ${error}`);
  }
};
