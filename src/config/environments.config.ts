import { getEnv } from '@lib';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), `.env`),
});

export const environment = {
  db: {
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_URI', true),
    seed: getEnv('DB_SEED', false),
  },
};
