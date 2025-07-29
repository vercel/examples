import { Manifest } from '@netlify/zip-it-and-ship-it';
import { EnvironmentContext } from '@netlify/blobs';
import { DevEventHandler } from '@netlify/dev-utils';
import { PipelineSource } from 'node:stream';

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
interface StreamingResponse extends Omit<HandlerResponse, 'body'> {
    body?: string | PipelineSource<any>;
}

interface HandlerCallback<ResponseType extends HandlerResponse = HandlerResponse> {
    (error: any, response: ResponseType): void;
}
interface BaseHandler<ResponseType extends HandlerResponse = HandlerResponse, C extends HandlerContext = HandlerContext> {
    (event: HandlerEvent, context: C, callback?: HandlerCallback<ResponseType>): void | Promise<ResponseType>;
}
type Handler = BaseHandler<HandlerResponse, HandlerContext>;

declare global {
    namespace awslambda {
        function streamifyResponse(handler: (event: HandlerEvent, responseStream: NodeJS.WritableStream, context: HandlerContext) => Promise<void>): Handler;
        namespace HttpResponseStream {
            function from(stream: NodeJS.WritableStream, metadata: Omit<StreamingResponse, 'body'>): NodeJS.WritableStream;
        }
    }
}

interface FunctionRegistryOptions {
    blobsContext?: EnvironmentContext;
    destPath: string;
    config: any;
    debug?: boolean;
    eventHandler?: DevEventHandler;
    frameworksAPIFunctionsPath?: string;
    internalFunctionsPath?: string;
    manifest?: Manifest;
    projectRoot: string;
    settings: any;
    timeouts: any;
    watch?: boolean;
}

interface FunctionMatch {
    handle: (req: Request) => Promise<Response>;
    preferStatic: boolean;
}
type FunctionsHandlerOptions = FunctionRegistryOptions & {
    accountId?: string;
    siteId?: string;
    userFunctionsPath?: string;
};
declare class FunctionsHandler {
    private accountID?;
    private buildCache;
    private registry;
    private scan;
    private siteID?;
    constructor({ accountId, siteId, userFunctionsPath, ...registryOptions }: FunctionsHandlerOptions);
    private invoke;
    match(request: Request): Promise<FunctionMatch | undefined>;
}

export { type FunctionMatch, FunctionsHandler };
