import { Pagination } from '@types';

export interface UserListQueryParams extends Pagination {
  username?: string;
}
