import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from './routes/api';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error: any) {
  console.error(chalk.red(`Error on index: ${error.message}`));
}
