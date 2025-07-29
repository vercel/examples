import { MaybePromise } from '@whatwg-node/promise-helpers';
import type { ServerAdapterPlugin } from './types.js';
export declare function createDefaultErrorHandler<TServerContext = {}>(ResponseCtor?: typeof Response): ErrorHandler<TServerContext>;
export declare class HTTPError extends Error {
    status: number;
    message: string;
    headers: HeadersInit;
    details?: any | undefined;
    name: string;
    constructor(status: number | undefined, message: string, headers?: HeadersInit, details?: any | undefined);
}
export type ErrorHandler<TServerContext> = (e: any, request: Request, ctx: TServerContext) => MaybePromise<Response> | void;
export declare function useErrorHandling<TServerContext>(onError?: ErrorHandler<TServerContext>): ServerAdapterPlugin<TServerContext>;
