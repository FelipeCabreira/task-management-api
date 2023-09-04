export enum Model {
  User = 'User',
  Board = 'Board',
  Task = 'Task',
  Tag = 'Tag',
}

export type Pagination = {
  page: number;
  limit: number;
};

export interface PaginatedResult<T> {
  totalCount: number;
  data: T[];
}
