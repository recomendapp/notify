import HttpError from './HttpError';

class DBInvalidEventTypeError extends HttpError {
	constructor(type: string) {
		super(400, `Invalid event type: ${type}`);
	}
}

export default DBInvalidEventTypeError;