import { environment } from '@config';
import { BoardController } from './board.controller';
import { UserController } from './user.controller';
import { ColumnController } from './column.controller';
import { MemberController } from './member.controller';

export { BoardController, UserController, ColumnController, MemberController };

const controllers: any[] = [BoardController, UserController, ColumnController, MemberController];

// if(environment.db.seed) {
//   controllers.push(SeedController);
// }

export { controllers };
