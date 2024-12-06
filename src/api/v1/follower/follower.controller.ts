import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../errors/DBInvalidEventTypeError';
import { followerCreated, followerAccepted } from './follower.service';

class FollowerController implements Controller {
  public path = '/follower';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.follow);
  }

  private follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
	  console.log('New follower event:', type);
      switch (type.toLowerCase()) {
        case 'insert':
          await followerCreated(req, res, next);
          break;
		case 'update':
		  await followerAccepted(req, res, next);
		  break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default FollowerController;