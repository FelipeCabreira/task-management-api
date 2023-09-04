import { environment } from '@config';
import { Pagination } from '@types';

export const getPaginationSettings = (settings: Pagination): Pagination => ({
  limit: settings.limit ?? environment.pagination.limit,
  page: settings.page ?? 1,
});
