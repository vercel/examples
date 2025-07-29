/**
 * Implements Lambda Response Streaming by polyfilling
 * `awslambda.streamifyResponse` and `awslambda.HttpResponseStream.from`.
 *
 * If they're used, `execute` will return a `ReadableStream` as `body`.
 *
 * See https://aws.amazon.com/fr/blogs/compute/introducing-aws-lambda-response-streaming/ for reference.
 */
/// <reference types="node" />
import { PassThrough } from "stream";
export declare class StreamingBody extends PassThrough {
    private readonly resolve;
    constructor(resolve: (metadata: any) => void);
    headersSent: boolean;
    sendHeader(metadata?: any): void;
    private contentType;
    setContentType(contentType: any): void;
}
