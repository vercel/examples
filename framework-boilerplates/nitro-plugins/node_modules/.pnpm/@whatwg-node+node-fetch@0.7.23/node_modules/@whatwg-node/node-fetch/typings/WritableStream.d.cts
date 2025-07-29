import { Writable } from 'node:stream';
export declare class PonyfillWritableStream<W = any> implements WritableStream<W> {
    writable: Writable;
    constructor(underlyingSink?: UnderlyingSink<W> | Writable);
    getWriter(): WritableStreamDefaultWriter<W>;
    close(): Promise<void>;
    abort(reason: any): Promise<void>;
    locked: boolean;
}
