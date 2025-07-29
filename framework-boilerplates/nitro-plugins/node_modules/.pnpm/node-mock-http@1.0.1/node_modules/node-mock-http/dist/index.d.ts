import NodeHTTP, { IncomingMessage as IncomingMessage$1 } from 'node:http';
import * as NodeNet from 'node:net';
import { Socket as Socket$1 } from 'node:net';
import * as NodeStream from 'node:stream';
import { EventEmitter } from 'node-mock-http/_polyfill/events';

type Callback<E = Error | null | undefined> = (error?: E) => void;
type BufferEncoding = any;

type DuplexClass = new () => NodeStream.Duplex;
declare const Duplex: DuplexClass;

declare class Socket extends Duplex implements NodeNet.Socket {
    __unenv__: {};
    readonly bufferSize: number;
    readonly bytesRead: number;
    readonly bytesWritten: number;
    readonly connecting: boolean;
    readonly destroyed: boolean;
    readonly pending: boolean;
    readonly localAddress: string;
    readonly localPort: number;
    readonly remoteAddress?: string;
    readonly remoteFamily?: string;
    readonly remotePort?: number;
    readonly autoSelectFamilyAttemptedAddresses: never[];
    readonly readyState: NodeNet.SocketReadyState;
    constructor(_options?: NodeNet.SocketConstructorOpts);
    write(_buffer: Uint8Array | string, _arg1?: BufferEncoding | Callback<Error | undefined>, _arg2?: Callback<Error | undefined>): boolean;
    connect(_arg1: number | string | NodeNet.SocketConnectOpts, _arg2?: string | Callback, _arg3?: Callback): this;
    end(_arg1?: Callback | Uint8Array | string, _arg2?: BufferEncoding | Callback, _arg3?: Callback): this;
    setEncoding(_encoding?: BufferEncoding): this;
    pause(): this;
    resume(): this;
    setTimeout(_timeout: number, _callback?: Callback): this;
    setNoDelay(_noDelay?: boolean): this;
    setKeepAlive(_enable?: boolean, _initialDelay?: number): this;
    address(): {};
    unref(): this;
    ref(): this;
    destroySoon(): void;
    resetAndDestroy(): this;
}

declare class Readable extends EventEmitter implements NodeStream.Readable {
    __unenv__: {};
    readonly readableEncoding: BufferEncoding | null;
    readonly readableEnded: boolean;
    readonly readableFlowing: boolean | null;
    readonly readableHighWaterMark: number;
    readonly readableLength: number;
    readonly readableObjectMode: boolean;
    readonly readableAborted: boolean;
    readonly readableDidRead: boolean;
    readonly closed: boolean;
    readonly errored: Error | null;
    readable: boolean;
    destroyed: boolean;
    static from(_iterable: Iterable<any> | AsyncIterable<any>, options?: NodeStream.ReadableOptions): Readable;
    constructor(_opts?: NodeStream.ReadableOptions);
    _read(_size: number): void;
    read(_size?: number): void;
    setEncoding(_encoding: BufferEncoding): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    unpipe(_destination?: any): this;
    unshift(_chunk: any, _encoding?: BufferEncoding): void;
    wrap(_oldStream: any): this;
    push(_chunk: any, _encoding?: BufferEncoding): boolean;
    _destroy(_error?: any, _callback?: Callback<any>): void;
    destroy(error?: Error): this;
    pipe<T>(_destination: T, _options?: {
        end?: boolean;
    }): T;
    compose<T extends NodeJS.ReadableStream>(_stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>, _options?: {
        signal: AbortSignal;
    } | undefined): T;
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.asyncIterator](): NodeJS.AsyncIterator<any>;
    iterator(_options?: {
        destroyOnReturn?: boolean | undefined;
    } | undefined): NodeJS.AsyncIterator<any>;
    map(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, _options?: ArrayOptions | undefined): NodeStream.Readable;
    filter(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, _options?: ArrayOptions | undefined): NodeStream.Readable;
    forEach(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => void | Promise<void>, _options?: ArrayOptions | undefined): Promise<void>;
    reduce(_fn: (accumulator: any, data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, _initialValue?: any, _options?: ArrayOptions | undefined): Promise<any>;
    find(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, _options?: ArrayOptions | undefined): Promise<any>;
    findIndex(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, _options?: ArrayOptions | undefined): Promise<number>;
    some(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, _options?: ArrayOptions | undefined): Promise<boolean>;
    toArray(_options?: Pick<ArrayOptions, "signal"> | undefined): Promise<any[]>;
    every(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean | Promise<boolean>, _options?: ArrayOptions | undefined): Promise<boolean>;
    flatMap(_fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, _options?: ArrayOptions | undefined): NodeStream.Readable;
    drop(_limit: number, _options?: Pick<ArrayOptions, "signal"> | undefined): NodeStream.Readable;
    take(_limit: number, _options?: Pick<ArrayOptions, "signal"> | undefined): NodeStream.Readable;
    asIndexedPairs(_options?: Pick<ArrayOptions, "signal"> | undefined): NodeStream.Readable;
}
interface ArrayOptions {
    concurrency?: number;
    signal?: AbortSignal;
}

declare class IncomingMessage extends Readable implements NodeHTTP.IncomingMessage {
    aborted: boolean;
    httpVersion: string;
    httpVersionMajor: number;
    httpVersionMinor: number;
    complete: boolean;
    connection: Socket;
    socket: Socket;
    headers: NodeHTTP.IncomingHttpHeaders;
    trailers: {};
    method: string;
    url: string;
    statusCode: number;
    statusMessage: string;
    closed: boolean;
    errored: Error | null;
    readable: boolean;
    constructor(socket?: Socket);
    get rawHeaders(): any[];
    get rawTrailers(): never[];
    setTimeout(_msecs: number, _callback?: () => void): this;
    get headersDistinct(): Record<string, string[]>;
    get trailersDistinct(): Record<string, string[]>;
}

declare class Writable extends EventEmitter implements NodeStream.Writable {
    __unenv__: {};
    readonly writable: boolean;
    writableEnded: boolean;
    writableFinished: boolean;
    readonly writableHighWaterMark: number;
    readonly writableLength: number;
    readonly writableObjectMode: boolean;
    readonly writableCorked: number;
    readonly closed: boolean;
    readonly errored: Error | null;
    readonly writableNeedDrain: boolean;
    readonly writableAborted: boolean;
    destroyed: boolean;
    _data: unknown;
    _encoding: BufferEncoding;
    constructor(_opts?: NodeStream.WritableOptions);
    pipe<T>(_destenition: T, _options?: {
        end?: boolean;
    }): T;
    _write(chunk: any, encoding: BufferEncoding, callback?: Callback): void;
    _writev?(_chunks: Array<{
        chunk: any;
        encoding: BufferEncoding;
    }>, _callback: (error?: Error | null) => void): void;
    _destroy(_error: any, _callback: Callback<any>): void;
    _final(_callback: Callback): void;
    write(chunk: any, arg2?: BufferEncoding | Callback, arg3?: Callback): boolean;
    setDefaultEncoding(_encoding: BufferEncoding): this;
    end(arg1: Callback | any, arg2?: Callback | BufferEncoding, arg3?: Callback): this;
    cork(): void;
    uncork(): void;
    destroy(_error?: Error): this;
    compose<T extends NodeJS.ReadableStream>(_stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>, _options?: {
        signal: AbortSignal;
    } | undefined): T;
}

declare class ServerResponse extends Writable implements NodeHTTP.ServerResponse<IncomingMessage$1> {
    statusCode: number;
    statusMessage: string;
    upgrading: boolean;
    chunkedEncoding: boolean;
    shouldKeepAlive: boolean;
    useChunkedEncodingByDefault: boolean;
    sendDate: boolean;
    finished: boolean;
    headersSent: boolean;
    strictContentLength: boolean;
    connection: Socket$1 | null;
    socket: Socket$1 | null;
    req: NodeHTTP.IncomingMessage;
    _headers: Record<string, number | string | string[] | undefined>;
    constructor(req: NodeHTTP.IncomingMessage);
    assignSocket(socket: Socket$1): void;
    _flush(): void;
    detachSocket(_socket: Socket$1): void;
    writeContinue(_callback?: Callback): void;
    writeHead(statusCode: number, arg1?: string | NodeHTTP.OutgoingHttpHeaders | NodeHTTP.OutgoingHttpHeader[], arg2?: NodeHTTP.OutgoingHttpHeaders | NodeHTTP.OutgoingHttpHeader[]): this;
    writeProcessing(): void;
    setTimeout(_msecs: number, _callback?: Callback): this;
    appendHeader(name: string, value: string | string[]): this;
    setHeader(name: string, value: number | string | string[]): this;
    setHeaders(headers: Headers | Map<string, number | string | readonly string[]>): this;
    getHeader(name: string): number | string | string[] | undefined;
    getHeaders(): NodeHTTP.OutgoingHttpHeaders;
    getHeaderNames(): string[];
    hasHeader(name: string): boolean;
    removeHeader(name: string): void;
    addTrailers(_headers: NodeHTTP.OutgoingHttpHeaders | ReadonlyArray<[string, string]>): void;
    flushHeaders(): void;
    writeEarlyHints(_headers: NodeHTTP.OutgoingHttpHeaders, cb: () => void): void;
}

type MaybePromise<T> = T | Promise<T>;
type NodeRequestHandler = (req: IncomingMessage, res: ServerResponse) => MaybePromise<void | unknown>;
type NodeRequestHeaders = Record<string, string | string[]>;
type NodeResponseHeaders = Record<string, string | undefined | number | string[]>;
type AbstractRequest = {
    [key: string]: any;
    url?: URL | string;
    method?: string;
    headers?: HeadersInit | NodeRequestHeaders;
    protocol?: string;
    body?: any;
};
type AbstractResponse = {
    body: any;
    headers: NodeResponseHeaders;
    status: number;
    statusText: string;
};

declare function callNodeRequestHandler(handler: NodeRequestHandler, aRequest: AbstractRequest): Promise<AbstractResponse>;

declare function fetchNodeRequestHandler(handler: NodeRequestHandler, url: string | URL, init?: RequestInit & AbstractRequest): Promise<Response>;

export { IncomingMessage, ServerResponse, callNodeRequestHandler, fetchNodeRequestHandler };
export type { AbstractRequest, AbstractResponse, NodeRequestHandler, NodeRequestHeaders, NodeResponseHeaders };
