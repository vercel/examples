import { Transform } from 'node:stream';
import { PonyfillReadableStream } from './ReadableStream.js';
import { endStream } from './utils.js';
import { PonyfillWritableStream } from './WritableStream.js';
export class PonyfillTransformStream {
    transform;
    writable;
    readable;
    constructor(transformer) {
        if (transformer instanceof Transform) {
            this.transform = transformer;
        }
        else if (transformer) {
            const controller = {
                enqueue(chunk) {
                    transform.push(chunk);
                },
                error(reason) {
                    transform.destroy(reason);
                },
                terminate() {
                    endStream(transform);
                },
                get desiredSize() {
                    return transform.writableLength;
                },
            };
            const transform = new Transform({
                read() { },
                write(chunk, _encoding, callback) {
                    try {
                        const result = transformer.transform?.(chunk, controller);
                        if (result instanceof Promise) {
                            result.then(() => {
                                callback();
                            }, err => {
                                callback(err);
                            });
                        }
                        else {
                            callback();
                        }
                    }
                    catch (err) {
                        callback(err);
                    }
                },
                final(callback) {
                    try {
                        const result = transformer.flush?.(controller);
                        if (result instanceof Promise) {
                            result.then(() => {
                                callback();
                            }, err => {
                                callback(err);
                            });
                        }
                        else {
                            callback();
                        }
                    }
                    catch (err) {
                        callback(err);
                    }
                },
            });
            this.transform = transform;
        }
        else {
            this.transform = new Transform();
        }
        this.writable = new PonyfillWritableStream(this.transform);
        this.readable = new PonyfillReadableStream(this.transform);
    }
}
