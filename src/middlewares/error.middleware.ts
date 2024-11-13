import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/HttpError";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};