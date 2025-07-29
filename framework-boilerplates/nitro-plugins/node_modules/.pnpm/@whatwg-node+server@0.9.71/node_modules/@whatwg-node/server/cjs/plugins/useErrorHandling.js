"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
exports.createDefaultErrorHandler = createDefaultErrorHandler;
exports.useErrorHandling = useErrorHandling;
const fetch_1 = require("@whatwg-node/fetch");
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
function createDefaultErrorHandler(ResponseCtor = fetch_1.Response) {
    return function defaultErrorHandler(e) {
        if (e.details || e.status || e.headers || e.name === 'HTTPError') {
            return new ResponseCtor(typeof e.details === 'object' ? JSON.stringify(e.details) : e.message, {
                status: e.status,
                headers: e.headers || {},
            });
        }
        console.error(e);
        return createDefaultErrorResponse(ResponseCtor);
    };
}
function createDefaultErrorResponse(ResponseCtor) {
    if (ResponseCtor.error) {
        return ResponseCtor.error();
    }
    return new ResponseCtor(null, { status: 500 });
}
class HTTPError extends Error {
    status;
    message;
    headers;
    details;
    name = 'HTTPError';
    constructor(status = 500, message, headers = {}, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.headers = headers;
        this.details = details;
        Error.captureStackTrace(this, HTTPError);
    }
}
exports.HTTPError = HTTPError;
function useErrorHandling(onError) {
    return {
        onRequest({ requestHandler, setRequestHandler, fetchAPI }) {
            const errorHandler = onError || createDefaultErrorHandler(fetchAPI.Response);
            setRequestHandler(function handlerWithErrorHandling(request, serverContext) {
                return (0, promise_helpers_1.handleMaybePromise)(() => requestHandler(request, serverContext), response => response, e => errorHandler(e, request, serverContext) ||
                    createDefaultErrorResponse(fetchAPI.Response));
            });
        },
    };
}
