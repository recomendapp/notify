import HttpError from './HttpError';

class DBInvalidTableError extends HttpError {
	constructor(table: string) {
		super(400, `Invalid table: ${table}`);
	}
}

export default DBInvalidTableError;