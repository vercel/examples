import { Transform } from 'node:stream';
import { PonyfillReadableStream } from './ReadableStream.js';
import { PonyfillWritableStream } from './WritableStream.js';
export declare class PonyfillTransformStream<I = any, O = any> implements TransformStream<I, O> {
    transform: Transform;
    writable: PonyfillWritableStream<I>;
    readable: PonyfillReadableStream<O>;
    constructor(transformer?: Transformer<I, O> | Transform);
}
