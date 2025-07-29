"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillWritableStream = void 0;
const node_events_1 = require("node:events");
const node_stream_1 = require("node:stream");
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
const utils_js_1 = require("./utils.js");
class PonyfillWritableStream {
    writable;
    constructor(underlyingSink) {
        if (underlyingSink instanceof node_stream_1.Writable) {
            this.writable = underlyingSink;
        }
        else if (underlyingSink) {
            const writable = new node_stream_1.Writable({
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
            this.writable = new node_stream_1.Writable();
        }
    }
    getWriter() {
        const writable = this.writable;
        return {
            get closed() {
                return (0, node_events_1.once)(writable, 'close');
            },
            get desiredSize() {
                return writable.writableLength;
            },
            get ready() {
                return (0, node_events_1.once)(writable, 'drain');
            },
            releaseLock() {
                // no-op
            },
            write(chunk) {
                const promise = (0, utils_js_1.fakePromise)();
                if (chunk == null) {
                    return promise;
                }
                return promise.then(() => (0, utils_js_1.safeWrite)(chunk, writable));
            },
            close() {
                if (!writable.errored && writable.closed) {
                    return (0, utils_js_1.fakePromise)();
                }
                if (writable.errored) {
                    return (0, promise_helpers_1.fakeRejectPromise)(writable.errored);
                }
                return (0, utils_js_1.fakePromise)().then(() => (0, utils_js_1.endStream)(writable));
            },
            abort(reason) {
                writable.destroy(reason);
                return (0, node_events_1.once)(writable, 'close');
            },
        };
    }
    close() {
        if (!this.writable.errored && this.writable.closed) {
            return (0, utils_js_1.fakePromise)();
        }
        if (this.writable.errored) {
            return (0, promise_helpers_1.fakeRejectPromise)(this.writable.errored);
        }
        return (0, utils_js_1.fakePromise)().then(() => (0, utils_js_1.endStream)(this.writable));
    }
    abort(reason) {
        this.writable.destroy(reason);
        return (0, node_events_1.once)(this.writable, 'close');
    }
    locked = false;
}
exports.PonyfillWritableStream = PonyfillWritableStream;
