import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../errors/DBInvalidEventTypeError';
import { insertSubscriber, deleteSubscriber, updateSubscriber } from './subscriber.service';

class SubscriberController implements Controller {
  public path = '/subscriber';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllSubscribers);
    this.router.post(this.path, this.manageSubscriber);
  }

  private getAllSubscribers = async (req: Request, res: Response) => {
	  res.send('Hello from subscriber controller');
  }

  private manageSubscriber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      switch (type.toLowerCase()) {
        case 'insert':
          await insertSubscriber(req, res, next);
          break;
        case 'update':
          await updateSubscriber(req, res, next);
          break;
        case 'delete':
          await deleteSubscriber(req, res, next);
          break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriberController;