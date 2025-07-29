import type { RequestListener } from 'node:http';
import type { MaybePromise, MaybePromiseLike } from '@whatwg-node/promise-helpers';
import type { NodeRequest, NodeResponse } from './utils.js';
import { UWSHandler, UWSRequest, UWSResponse } from './uwebsockets.js';
export interface FetchEvent extends Event {
    waitUntil(f: MaybePromise<void>): void;
    request: Request;
    respondWith(r: MaybePromiseLike<Response>): void;
}
export interface ServerAdapterBaseObject<TServerContext, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>> {
    /**
     * An async function that takes `Request` and the server context and returns a `Response`.
     * If you use `requestListener`, the server context is `{ req: IncomingMessage, res: ServerResponse }`.
     */
    handle: THandleRequest;
}
export interface ServerAdapterObject<TServerContext> extends EventListenerObject, AsyncDisposable {
    /**
     * A basic request listener that takes a `Request` with the server context and returns a `Response`.
     */
    handleRequest: (request: Request, ctx: TServerContext & Partial<ServerAdapterInitialContext>) => MaybePromise<Response>;
    /**
     * WHATWG Fetch spec compliant `fetch` function that can be used for testing purposes.
     */
    fetch(request: Request, ctx: TServerContext): MaybePromise<Response>;
    fetch(request: Request, ...ctx: Partial<TServerContext>[]): MaybePromise<Response>;
    fetch(urlStr: string, ctx: TServerContext): MaybePromise<Response>;
    fetch(urlStr: string, ...ctx: Partial<TServerContext>[]): MaybePromise<Response>;
    fetch(urlStr: string, init: RequestInit, ctx: TServerContext): MaybePromise<Response>;
    fetch(urlStr: string, init: RequestInit, ...ctx: Partial<TServerContext>[]): MaybePromise<Response>;
    fetch(url: URL, ctx: TServerContext): MaybePromise<Response>;
    fetch(url: URL, ...ctx: Partial<TServerContext>[]): MaybePromise<Response>;
    fetch(url: URL, init: RequestInit, ctx: TServerContext): MaybePromise<Response>;
    fetch(url: URL, init: RequestInit, ...ctx: Partial<TServerContext>[]): MaybePromise<Response>;
    /**
     * This function takes Node's request object and returns a WHATWG Fetch spec compliant `Response` object.
     *
     * @deprecated Use `handleNodeRequestAndResponse` instead.
     **/
    handleNodeRequest(nodeRequest: NodeRequest, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): MaybePromise<Response>;
    /**
     * This function takes Node's request and response objects and returns a WHATWG Fetch spec compliant `Response` object.
     */
    handleNodeRequestAndResponse(nodeRequest: NodeRequest, nodeResponseOrContainer: {
        raw: NodeResponse;
    } | NodeResponse, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): MaybePromise<Response>;
    /**
     * A request listener function that can be used with any Node server variation.
     */
    requestListener: RequestListener;
    handleUWS: UWSHandler;
    handle(req: NodeRequest, res: NodeResponse, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): Promise<void>;
    handle(requestLike: RequestLike, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): MaybePromise<Response>;
    handle(request: Request, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): MaybePromise<Response>;
    handle(fetchEvent: FetchEvent & Partial<TServerContext & ServerAdapterInitialContext>, ...ctx: Partial<TServerContext>[]): void;
    handle(res: UWSResponse, req: UWSRequest, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): Promise<void>;
    handle(container: {
        request: Request;
    } & Partial<TServerContext & ServerAdapterInitialContext>, ...ctx: Partial<TServerContext & ServerAdapterInitialContext>[]): MaybePromise<Response>;
    disposableStack: AsyncDisposableStack;
    dispose(): Promise<void> | void;
}
export interface RequestLike {
    url: string;
    method: string;
    headers: HeadersLike;
    body?: AsyncIterable<Uint8Array> | null;
}
export interface HeadersLike extends Iterable<[string, string]> {
    get(name: string): string | null | undefined;
    set(name: string, value: string): void;
    has(name: string): boolean;
}
export type ServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>> = TBaseObject & ServerAdapterObject<TServerContext>['handle'] & ServerAdapterObject<TServerContext>;
export type ServerAdapterRequestHandler<TServerContext> = (request: Request, ctx: TServerContext & ServerAdapterInitialContext) => MaybePromise<Response>;
export type ServerAdapterNodeContext = {
    req: NodeRequest;
    res: NodeResponse;
};
export type WaitUntilFn = (promise: Promise<void> | void) => void;
export type FetchAPI = ReturnType<typeof import('@whatwg-node/fetch').createFetch>;
export type ServerAdapterInitialContext = {
    /**
     * Register a promise that should be waited in the background for before the server process is exited.
     *
     * This also avoids unhandled promise rejections, which would otherwise cause the process to exit on some environment like Node.
     * @param promise The promise to wait for
     * @returns
     */
    waitUntil: WaitUntilFn;
};
