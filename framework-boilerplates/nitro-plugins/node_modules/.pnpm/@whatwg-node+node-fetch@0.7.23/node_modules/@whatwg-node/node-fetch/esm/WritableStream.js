import { once } from 'node:events';
import { Writable } from 'node:stream';
import { fakeRejectPromise } from '@whatwg-node/promise-helpers';
import { endStream, fakePromise, safeWrite } from './utils.js';
export class PonyfillWritableStream {
    writable;
    constructor(underlyingSink) {
        if (underlyingSink instanceof Writable) {
            this.writable = underlyingSink;
        }
        else if (underlyingSink) {
            const writable = new Writable({
                write(chunk, _encoding, callback) {
                    try {
                        const result = underlyingSink.write?.(chunk, controller);
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
                    const result = underlyingSink.close?.();
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
                },
            });
            this.writable = writable;
            const abortCtrl = new AbortController();
            const controller = {
                signal: abortCtrl.signal,
                error(e) {
                    writable.destroy(e);
                },
            };
            writable.once('error', err => abortCtrl.abort(err));
            writable.once('close', () => abortCtrl.abort());
        }
        else {
            this.writable = new Writable();
        }
    }
    getWriter() {
        const writable = this.writable;
        return {
            get closed() {
                return once(writable, 'close');
            },
            get desiredSize() {
                return writable.writableLength;
            },
            get ready() {
                return once(writable, 'drain');
            },
            releaseLock() {
                // no-op
            },
            write(chunk) {
                const promise = fakePromise();
                if (chunk == null) {
                    return promise;
                }
                return promise.then(() => safeWrite(chunk, writable));
            },
            close() {
                if (!writable.errored && writable.closed) {
                    return fakePromise();
                }
                if (writable.errored) {
                    return fakeRejectPromise(writable.errored);
                }
                return fakePromise().then(() => endStream(writable));
            },
            abort(reason) {
                writable.destroy(reason);
                return once(writable, 'close');
            },
        };
    }
    close() {
        if (!this.writable.errored && this.writable.closed) {
            return fakePromise();
        }
        if (this.writable.errored) {
            return fakeRejectPromise(this.writable.errored);
        }
        return fakePromise().then(() => endStream(this.writable));
    }
    abort(reason) {
        this.writable.destroy(reason);
        return once(this.writable, 'close');
    }
    locked = false;
}
