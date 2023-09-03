import mongoose from 'mongoose';
import { environment } from './environments.config';
import chalk from 'chalk';

export const databaseConnect = async () => {
  try {
    await mongoose.connect(environment.db.database);
    console.log(chalk.yellow('Connected to database'));
  } catch (error: any) {
    console.log(chalk.red('Failed to connected to database'));
    console.error(error);
    process.exit(1);
  }
};
