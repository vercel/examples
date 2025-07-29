import { PipelineSource } from 'node:stream';
export { Context } from '@netlify/serverless-functions-api';

interface HandlerContext {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: {
        [key: string]: any;
    };
    clientContext?: {
        [key: string]: any;
    };
    getRemainingTimeInMillis(): number;
    /** @deprecated Use handler callback or promise result */
    done(error?: Error, result?: any): void;
    /** @deprecated Use handler callback with first argument or reject a promise result */
    fail(error: Error | string): void;
    /** @deprecated Use handler callback with second argument or resolve a promise result */
    succeed(messageOrObject: any): void;
    /** @deprecated Use handler callback or promise result */
    succeed(message: string, object: any): void;
}

interface EventHeaders {
    [name: string]: string | undefined;
}
interface EventMultiValueHeaders {
    [name: string]: string[] | undefined;
}
interface EventQueryStringParameters {
    [name: string]: string | undefined;
}
interface EventMultiValueQueryStringParameters {
    [name: string]: string[] | undefined;
}
interface HandlerEvent {
    rawUrl: string;
    rawQuery: string;
    path: string;
    httpMethod: string;
    headers: EventHeaders;
    multiValueHeaders: EventMultiValueHeaders;
    queryStringParameters: EventQueryStringParameters | null;
    multiValueQueryStringParameters: EventMultiValueQueryStringParameters | null;
    body: string | null;
    isBase64Encoded: boolean;
    route?: string;
}

interface HandlerResponse {
    statusCode: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    multiValueHeaders?: {
        [header: string]: ReadonlyArray<boolean | number | string>;
    };
    body?: string;
    isBase64Encoded?: boolean;
}
interface BuilderResponse extends HandlerResponse {
    ttl?: number;
}
interface StreamingResponse extends Omit<HandlerResponse, 'body'> {
    body?: string | PipelineSource<any>;
}

interface HandlerCallback<ResponseType extends HandlerResponse = HandlerResponse> {
    (error: any, response: ResponseType): void;
}
interface BaseHandler<ResponseType extends HandlerResponse = HandlerResponse, C extends HandlerContext = HandlerContext> {
    (event: HandlerEvent, context: C, callback?: HandlerCallback<ResponseType>): void | Promise<ResponseType>;
}
interface BackgroundHandler<C extends HandlerContext = HandlerContext> {
    (event: HandlerEvent, context: C): void | Promise<void>;
}
type Handler = BaseHandler<HandlerResponse, HandlerContext>;
type BuilderHandler = BaseHandler<BuilderResponse, HandlerContext>;
interface StreamingHandler {
    (event: HandlerEvent, context: HandlerContext): Promise<StreamingResponse>;
}

declare const wrapHandler: (handler: BuilderHandler) => Handler;

interface BasePurgeCacheOptions {
    apiURL?: string;
    deployAlias?: string;
    tags?: string[];
    token?: string;
    userAgent?: string;
}
interface PurgeCacheOptionsWithSiteID extends BasePurgeCacheOptions {
    siteID?: string;
}
interface PurgeCacheOptionsWithSiteSlug extends BasePurgeCacheOptions {
    siteSlug: string;
}
interface PurgeCacheOptionsWithDomain extends BasePurgeCacheOptions {
    domain: string;
}
type PurgeCacheOptions = PurgeCacheOptionsWithSiteID | PurgeCacheOptionsWithSiteSlug | PurgeCacheOptionsWithDomain;
declare const purgeCache: (options?: PurgeCacheOptions) => Promise<void>;

type Path = `/${string}`;
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
type CronSchedule = string;
type RateLimitAggregator = 'domain' | 'ip';
type RateLimitAction = 'rate_limit' | 'rewrite';
interface RateLimitConfig {
    action?: RateLimitAction;
    aggregateBy?: RateLimitAggregator | RateLimitAggregator[];
    to?: string;
    windowSize: number;
}
interface BaseConfig {
    /**
     * Configures the function to serve any static files that match the request
     * URL and render the function only if no matching files exist.
     */
    preferStatic?: boolean;
    /**
     * Limits the HTTP methods for which the function will run. If not set, the
     * function will run for all supported methods.
     */
    method?: HTTPMethod | HTTPMethod[];
    rateLimit?: RateLimitConfig;
}
interface ConfigWithPath extends BaseConfig {
    /**
     * One or more URL paths for which the function will not run, even if they
     * match a path defined with the `path` property. Paths must begin with a
     * forward slash.
     *
     * {@link} https://ntl.fyi/func-routing
     */
    excludedPath?: Path | Path[];
    /**
     * One or more URL paths for which the function will run. Paths must begin
     * with a forward slash.
     *
     * {@link} https://ntl.fyi/func-routing
     */
    path?: Path | Path[];
    /**
     * The `schedule` property cannot be used when `path` is used.
     */
    schedule?: never;
}
interface ConfigWithSchedule extends BaseConfig {
    /**
     * The `excludedPath` property cannot be used when `schedule` is used.
     */
    excludedPath?: never;
    /**
     * The `path` property cannot be used when `schedule` is used.
     */
    path?: never;
    /**
     * Cron expression representing the schedule at which the function will be
     * automatically invoked.
     *
     * {@link} https://ntl.fyi/sched-func
     */
    schedule: CronSchedule;
}
type Config = ConfigWithPath | ConfigWithSchedule;

/**
 * Declares a function to run on a cron schedule.
 * Not reachable via HTTP.
 *
 * @example
 * ```
 * export const handler = cron("5 4 * * *", async () => {
 *   // ...
 * })
 * ```
 *
 * @param schedule expressed as cron string.
 * @param handler
 * @see https://ntl.fyi/sched-func
 */
declare const schedule: (cron: string, handler: Handler) => Handler;

declare global {
    namespace awslambda {
        function streamifyResponse(handler: (event: HandlerEvent, responseStream: NodeJS.WritableStream, context: HandlerContext) => Promise<void>): Handler;
        namespace HttpResponseStream {
            function from(stream: NodeJS.WritableStream, metadata: Omit<StreamingResponse, 'body'>): NodeJS.WritableStream;
        }
    }
}
/**
 * Enables streaming responses. `body` accepts a Node.js `Readable` stream or a WHATWG `ReadableStream`.
 *
 * @example
 * ```
 * const { Readable } = require('stream');
 *
 * export const handler = stream(async (event, context) => {
 *   const stream = Readable.from(Buffer.from(JSON.stringify(event)))
 *   return {
 *     statusCode: 200,
 *     body: stream,
 *   }
 * })
 * ```
 *
 * @example
 * ```
 * export const handler = stream(async (event, context) => {
 *   const response = await fetch('https://api.openai.com/', { ... })
 *   // ...
 *   return {
 *     statusCode: 200,
 *     body: response.body, // Web stream
 *   }
 * })
 * ```
 *
 * @param handler
 * @see https://ntl.fyi/streaming-func
 */
declare const stream: (handler: StreamingHandler) => Handler;

export { type BackgroundHandler, type BuilderHandler, type BuilderResponse, type Config, type Handler, type HandlerCallback, type HandlerContext, type HandlerEvent, type HandlerResponse, type StreamingHandler, type StreamingResponse, wrapHandler as builder, purgeCache, schedule, stream };
