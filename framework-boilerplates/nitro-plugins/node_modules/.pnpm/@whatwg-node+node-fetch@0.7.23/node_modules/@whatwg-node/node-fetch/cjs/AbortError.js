"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillAbortError = void 0;
class PonyfillAbortError extends Error {
    constructor(reason) {
        let message = 'The operation was aborted';
        if (reason) {
            message += ` reason: ${reason}`;
        }
        super(message, {
            cause: reason,
        });
        this.name = 'AbortError';
    }
    get reason() {
        return this.cause;
    }
}
exports.PonyfillAbortError = PonyfillAbortError;
