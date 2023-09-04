import { environment } from '@config';
import { BoardController } from './board.controller';
import { UserController } from './user.controller';

export { BoardController, UserController };

const controllers: any[] = [BoardController, UserController];

// if(environment.db.seed) {
//   controllers.push(SeedController);
// }

export { controllers };
