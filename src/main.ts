import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from './routes/api';
import chalk from 'chalk';
import { databaseConnect, logger } from '@config';
import { environment } from '@config';
import { useExpressServer } from 'routing-controllers';
import { controllers } from '@controllers';

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// app.use('/api', apiRouter);

const routingControllersOptions = {
  cors: true,
  routePrefix: environment.app.routePrefix,
  classTransformer: false,
  defaultErrorHandler: false,
  controllers,
};

useExpressServer(app, routingControllersOptions);

databaseConnect();

try {
  app.listen(environment.app.port, (): void => {
    const server = `http://localhost:${environment.app.port}`;
    console.log(chalk.green(`Connected successfully - server is running on ${chalk.bold(server)}`));
    console.log(
      chalk.cyan(`API is running on ${chalk.bold(`${server}/${environment.app.routePrefix}`)}`),
    );
  });
} catch (error: any) {
  console.error(chalk.red(`Error on index: ${error.message}`));
}
