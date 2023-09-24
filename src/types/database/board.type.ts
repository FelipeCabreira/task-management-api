import { TaskDocument, UserDocument } from '@types-database';
import { HydratedDocument, Model, PopulatedDoc, Types } from 'mongoose';

export type BoardFields =
  | '_id'
  | 'name'
  | 'description'
  | 'members'
  | 'tags'
  | 'columns'
  | 'timeCreated';

export interface IColumn {
  name: string;
  tasks: PopulatedDoc<TaskDocument>[];
}

export type ColumnDocument = HydratedDocument<IColumn>;

export type BoardMember = { user: PopulatedDoc<UserDocument> };

export interface IBoard {
  name: string;
  description: string;
  timeCreated: Date;
  members: BoardMember[];
  tags?: Types.ObjectId[];
  columns: ColumnDocument[];
}

export type BoardModel = Model<IBoard>;

export type BoardDocument = HydratedDocument<IBoard>;
