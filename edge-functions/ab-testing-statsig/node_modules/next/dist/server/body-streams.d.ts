/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage } from 'http';
import { Readable } from 'stream';
export declare function requestToBodyStream(context: {
    ReadableStream: typeof ReadableStream;
}, KUint8Array: typeof Uint8Array, stream: Readable): ReadableStream<any>;
export interface ClonableBody {
    finalize(): Promise<void>;
    cloneBodyStream(): Readable;
}
export declare function getClonableBody<T extends IncomingMessage>(readable: T): ClonableBody;
