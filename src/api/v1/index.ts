import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';

class IndexController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.helloWorld);
  }

  private helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('Hello from Notify API');
    } catch (error) {
      next(error);
    }
  }
}

export default IndexController;
