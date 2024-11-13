import { NextFunction, Request, Response } from "express";
import NotAuthorizedException from "../errors/NotAuthorizedError";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	const [_, apiKey] = authorization?.split(' ') || [];

	if (apiKey && apiKey === process.env.API_KEY) {
		next();
	} else {
		throw new NotAuthorizedException();
	}
}