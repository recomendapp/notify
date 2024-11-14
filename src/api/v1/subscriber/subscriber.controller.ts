import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../errors/DBInvalidEventTypeError';
import { insertSubscriber, deleteSubscriber, updateSubscriber, manageFcmTokens } from './subscriber.service';
import { supabase } from '../../../lib/supabase';

class SubscriberController implements Controller {
  public path = '/subscriber';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllSubscribers);
    this.router.post(this.path, this.manageSubscriber);
    this.router.post(`${this.path}/tokens`, this.manageTokens);
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

  private manageTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { record } = req.body;
      const { data, error: errTokens } = await supabase
        .from('user_notification_tokens')
        .select('*')
        .eq('user_id', record.user_id);
      if (errTokens) throw errTokens;
      manageFcmTokens(record.user_id, data.filter((token: any) => token.provider === 'fcm'));
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriberController;