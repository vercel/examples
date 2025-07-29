export class FunctionBundlingUserError extends Error {
    constructor(message, customErrorInfo) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'FunctionBundlingUserError';
        Error.captureStackTrace(this, FunctionBundlingUserError);
        FunctionBundlingUserError.addCustomErrorInfo(this, customErrorInfo);
    }
    static addCustomErrorInfo(error, customErrorInfo) {
        const info = {
            type: 'functionsBundling',
            location: customErrorInfo,
        };
        error.customErrorInfo = info;
        return error;
    }
}
