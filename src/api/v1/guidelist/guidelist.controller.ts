import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../errors/DBInvalidEventTypeError';
import { guidelistCompleted, guidelistSent } from './guidelist.service';

class GuidelistController implements Controller {
  public path = '/guidelist';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.manageGuidelist);
  }

  private manageGuidelist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      switch (type.toLowerCase()) {
        case 'insert':
          await guidelistSent(req, res, next);
          break;
        case 'update':
          await guidelistCompleted(req, res, next);
          break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default GuidelistController;