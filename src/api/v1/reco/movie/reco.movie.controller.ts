import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../../../interfaces/controller.interface';
import DBInvalidEventTypeError from '../../../../errors/DBInvalidEventTypeError';
import { recoMovieCompleted, recoMovieSent } from './reco.movie.service';

class RecoMovieController implements Controller {
  public path = '/reco/movie';
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
          await recoMovieSent(req, res, next);
          break;
        case 'update':
          await recoMovieCompleted(req, res, next);
          break;
        default:
          throw new DBInvalidEventTypeError(type);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default RecoMovieController;