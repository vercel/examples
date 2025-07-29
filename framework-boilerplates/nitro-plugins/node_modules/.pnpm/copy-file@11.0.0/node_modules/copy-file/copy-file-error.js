export default class CopyFileError extends Error {
	constructor(message, {cause} = {}) {
		super(message, {cause});
		Object.assign(this, cause);
		this.name = 'CopyFileError';
	}
}
