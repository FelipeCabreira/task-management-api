import { databaseConnect, environment, logger } from '@config';
import { controllers } from '@controllers';
import chalk from 'chalk';
import cors from 'cors';
import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

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
