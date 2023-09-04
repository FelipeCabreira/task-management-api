import { getEnv, toBool, toNumber } from '@lib-utils';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), `.env`),
});

export const environment = {
  node: getEnv('NODE_ENV', false),
  app: {
    routePrefix: getEnv('APP_ROUTE_PREFIX', false, 'api'),
    port: getEnv('PORT', true),
    banner: toBool(getEnv('APP_BANNER', false, 'true')),
  },
  pagination: {
    limit: toNumber(getEnv('PAGINATION_LIMIT', false, '10')),
  },
  db: {
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_URI', true),
    seed: getEnv('DB_SEED', false),
  },
};
