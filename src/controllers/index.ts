import { environment } from '@config';
import { BoardController } from './board.controller';

export { BoardController };

const controllers: any[] = [BoardController];

// if(environment.db.seed) {
//   controllers.push(SeedController);
// }

export { controllers };
