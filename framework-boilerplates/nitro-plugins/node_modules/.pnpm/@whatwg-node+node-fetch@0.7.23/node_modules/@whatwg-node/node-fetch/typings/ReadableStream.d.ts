import { Readable } from 'node:stream';
export declare class PonyfillReadableStream<T> implements ReadableStream<T> {
    readable: Readable;
    constructor(underlyingSource?: UnderlyingSource<T> | Readable | ReadableStream<T> | PonyfillReadableStream<T>);
    cancel(reason?: any): Promise<void>;
    locked: boolean;
    getReader(options: {
        mode: 'byob';
    }): ReadableStreamBYOBReader;
    getReader(): ReadableStreamDefaultReader<T>;
    [Symbol.asyncIterator](): {
        [Symbol.asyncIterator](): /*elided*/ any;
        next: () => Promise<IteratorResult<any, undefined>>;
        return: () => Promise<IteratorResult<any, undefined>>;
        throw: (err: Error) => Promise<IteratorResult<any, undefined>>;
    };
    tee(): [ReadableStream<T>, ReadableStream<T>];
    private pipeToWriter;
    pipeTo(destination: WritableStream<T>): Promise<void>;
    pipeThrough<T2>({ writable, readable, }: {
        writable: WritableStream<T>;
        readable: ReadableStream<T2>;
    }): ReadableStream<T2>;
    static [Symbol.hasInstance](instance: unknown): instance is PonyfillReadableStream<unknown>;
    static from<T>(iterable: AsyncIterable<T> | Iterable<T>): PonyfillReadableStream<T>;
    [Symbol.toStringTag]: string;
}
