import { Agent as HTTPAgent } from 'node:http';
import { Agent as HTTPSAgent } from 'node:https';
import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.js';
import { PonyfillHeadersInit } from './Headers.js';
export type RequestPonyfillInit = PonyfillBodyOptions & Omit<RequestInit, 'body' | 'headers'> & {
    body?: BodyPonyfillInit | null | undefined;
    duplex?: 'half' | 'full' | undefined;
    headers?: PonyfillHeadersInit | undefined;
    headersSerializer?: HeadersSerializer | undefined;
    agent?: HTTPAgent | HTTPSAgent | false | undefined;
};
type HeadersSerializer = (headers: Headers, onContentLength?: (contentLength: string) => void) => string[];
export declare class PonyfillRequest<TJSON = any> extends PonyfillBody<TJSON> implements Request {
    constructor(input: RequestInfo | URL, options?: RequestPonyfillInit);
    headersSerializer?: HeadersSerializer | undefined;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    headers: Headers;
    integrity: string;
    keepalive: boolean;
    method: string;
    mode: RequestMode;
    priority: 'auto' | 'high' | 'low';
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    _url: string | undefined;
    get signal(): AbortSignal;
    get url(): string;
    _parsedUrl: URL | undefined;
    get parsedUrl(): URL;
    duplex: 'half' | 'full';
    agent: HTTPAgent | HTTPSAgent | false | undefined;
    clone(): PonyfillRequest<TJSON>;
    [Symbol.toStringTag]: string;
}
export {};
