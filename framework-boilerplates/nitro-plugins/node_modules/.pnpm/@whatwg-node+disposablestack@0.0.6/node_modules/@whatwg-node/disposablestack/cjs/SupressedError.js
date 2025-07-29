"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillSuppressedError = void 0;
class PonyfillSuppressedError extends Error {
    error;
    suppressed;
    // eslint-disable-next-line n/handle-callback-err
    constructor(error, suppressed, message) {
        super(message);
        this.error = error;
        this.suppressed = suppressed;
        this.name = 'SuppressedError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.PonyfillSuppressedError = PonyfillSuppressedError;
