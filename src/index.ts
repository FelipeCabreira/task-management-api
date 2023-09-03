import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from './routes/api';
import chalk from 'chalk';
import { logger } from './config/logger';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/api', apiRouter);

try {
  app.listen(PORT, (): void => {
    const server = `http://localhost:${PORT}`;
    console.log(chalk.green(`Connected successfully - server is running on ${chalk.bold(server)}`));
    console.log(chalk.cyan(`API is running on ${chalk.bold(`${server}/`)}`));
  });
} catch (error: any) {
  console.error(chalk.red(`Error on index: ${error.message}`));
}
