import { Pagination } from '@types-utils';

export interface UserListQueryParams extends Pagination {
  username?: string;
}
