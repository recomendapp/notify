import express from 'express';
import bodyParser from 'body-parser';
import { serve } from "@novu/framework/express";
import Controller from './interfaces/controller.interface';
import { errorMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { guidelistWorkflows } from './workflows/guidelist.workflow';

class App {
  public app: express.Application;
  public port: number = parseInt(process.env.PORT || '9000');

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
	this.app.use("/novu", serve({ workflows: [
		...guidelistWorkflows,
	]}))
	this.app.use((req, res, next) => {
		if (!req.path.startsWith("/novu")) {
		  return authMiddleware(req, res, next);
		}
		next();
	});
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;