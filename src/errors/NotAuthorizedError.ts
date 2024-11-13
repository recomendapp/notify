import HttpError from './HttpError';

class NotAuthorizedError extends HttpError {
	constructor() {
		super(403, "Not authorized");
	}
}

export default NotAuthorizedError;