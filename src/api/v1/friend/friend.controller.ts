import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../errors/DBInvalidEventTypeError';
import { friendCreated } from './friend.service';

class FriendController implements Controller {
  public path = '/friend';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.friend);
  }

  private friend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      switch (type.toLowerCase()) {
        case 'insert':
          await friendCreated(req, res, next);
          break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default FriendController;