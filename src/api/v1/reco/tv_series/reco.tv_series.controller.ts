import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../../errors/DBInvalidEventTypeError';
import { recoTvSeriesCompleted, recoTvSeriesSent } from './reco.tv_series.service';

class RecoTvSeriesController implements Controller {
  public path = '/reco/tv_series';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.manageReco);
  }

  private manageReco = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      switch (type.toLowerCase()) {
        case 'insert':
          await recoTvSeriesSent(req, res, next);
          break;
        case 'update':
          await recoTvSeriesCompleted(req, res, next);
          break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default RecoTvSeriesController;