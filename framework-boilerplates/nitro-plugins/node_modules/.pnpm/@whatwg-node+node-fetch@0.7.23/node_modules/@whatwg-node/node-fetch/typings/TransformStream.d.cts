import { Transform } from 'node:stream';
import { PonyfillReadableStream } from './ReadableStream.cjs';
import { PonyfillWritableStream } from './WritableStream.cjs';
export declare class PonyfillTransformStream<I = any, O = any> implements TransformStream<I, O> {
    transform: Transform;
    writable: PonyfillWritableStream<I>;
    readable: PonyfillReadableStream<O>;
    constructor(transformer?: Transformer<I, O> | Transform);
}
