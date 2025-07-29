"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillReadableStream = void 0;
const node_buffer_1 = require("node:buffer");
const node_events_1 = require("node:events");
const node_stream_1 = require("node:stream");
const promises_1 = require("node:stream/promises");
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
const utils_js_1 = require("./utils.js");
function createController(desiredSize, readable) {
    let chunks = [];
    let _closed = false;
    let flushed = false;
    return {
        desiredSize,
        enqueue(chunk) {
            const buf = typeof chunk === 'string' ? node_buffer_1.Buffer.from(chunk) : chunk;
            if (!flushed) {
                chunks.push(buf);
            }
            else {
                readable.push(buf);
            }
        },
        close() {
            if (chunks.length > 0) {
                this._flush();
            }
            readable.push(null);
            _closed = true;
        },
        error(error) {
            if (chunks.length > 0) {
                this._flush();
            }
            readable.destroy(error);
        },
        get _closed() {
            return _closed;
        },
        _flush() {
            flushed = true;
            if (chunks.length > 0) {
                const concatenated = chunks.length > 1 ? node_buffer_1.Buffer.concat(chunks) : chunks[0];
                readable.push(concatenated);
                chunks = [];
            }
        },
    };
}
function isNodeReadable(obj) {
    return obj?.read != null;
}
function isReadableStream(obj) {
    return obj?.getReader != null;
}
class PonyfillReadableStream {
    readable;
    constructor(underlyingSource) {
        if (underlyingSource instanceof PonyfillReadableStream && underlyingSource.readable != null) {
            this.readable = underlyingSource.readable;
        }
        else if (isNodeReadable(underlyingSource)) {
            this.readable = underlyingSource;
        }
        else if (isReadableStream(underlyingSource)) {
            this.readable = node_stream_1.Readable.fromWeb(underlyingSource);
        }
        else {
            let started = false;
            let ongoing = false;
            const handleStart = (desiredSize) => {
                if (!started) {
                    const controller = createController(desiredSize, this.readable);
                    started = true;
                    return (0, promise_helpers_1.handleMaybePromise)(() => underlyingSource?.start?.(controller), () => {
                        controller._flush();
                        if (controller._closed) {
                            return false;
                        }
                        return true;
                    });
                }
                return true;
            };
            const readImpl = (desiredSize) => {
                return (0, promise_helpers_1.handleMaybePromise)(() => handleStart(desiredSize), shouldContinue => {
                    if (!shouldContinue) {
                        return;
                    }
                    const controller = createController(desiredSize, this.readable);
                    return (0, promise_helpers_1.handleMaybePromise)(() => underlyingSource?.pull?.(controller), () => {
                        controller._flush();
                        ongoing = false;
                    });
                });
            };
            this.readable = new node_stream_1.Readable({
                read(desiredSize) {
                    if (ongoing) {
                        return;
                    }
                    ongoing = true;
                    return readImpl(desiredSize);
                },
                destroy(err, callback) {
                    if (underlyingSource?.cancel) {
                        try {
                            const res$ = underlyingSource.cancel(err);
                            if (res$?.then) {
                                return res$.then(() => {
                                    callback(null);
                                }, err => {
                                    callback(err);
                                });
                            }
                        }
                        catch (err) {
                            callback(err);
                            return;
                        }
                    }
                    callback(null);
                },
            });
        }
    }
    cancel(reason) {
        this.readable.destroy(reason);
        // @ts-expect-error - we know it is void
        return (0, node_events_1.once)(this.readable, 'close');
    }
    locked = false;
    getReader(_options) {
        const iterator = this.readable[Symbol.asyncIterator]();
        this.locked = true;
        const thisReadable = this.readable;
        return {
            read() {
                return iterator.next();
            },
            releaseLock: () => {
                if (iterator.return) {
                    const retResult$ = iterator.return();
                    if (retResult$.then) {
                        retResult$.then(() => {
                            this.locked = false;
                        });
                        return;
                    }
                }
                this.locked = false;
            },
            cancel: reason => {
                if (iterator.return) {
                    const retResult$ = iterator.return(reason);
                    if (retResult$.then) {
                        return retResult$.then(() => {
                            this.locked = false;
                        });
                    }
                }
                this.locked = false;
                return (0, utils_js_1.fakePromise)();
            },
            get closed() {
                return Promise.race([
                    (0, node_events_1.once)(thisReadable, 'end'),
                    (0, node_events_1.once)(thisReadable, 'error').then(err => Promise.reject(err)),
                ]);
            },
        };
    }
    [Symbol.asyncIterator]() {
        const iterator = this.readable[Symbol.asyncIterator]();
        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => iterator.next(),
            return: () => {
                if (!this.readable.destroyed) {
                    this.readable.destroy();
                }
                return iterator.return?.() || (0, utils_js_1.fakePromise)({ done: true, value: undefined });
            },
            throw: (err) => {
                if (!this.readable.destroyed) {
                    this.readable.destroy(err);
                }
                return iterator.throw?.(err) || (0, utils_js_1.fakePromise)({ done: true, value: undefined });
            },
        };
    }
    tee() {
        throw new Error('Not implemented');
    }
    async pipeToWriter(writer) {
        try {
            for await (const chunk of this) {
                await writer.write(chunk);
            }
            await writer.close();
        }
        catch (err) {
            await writer.abort(err);
        }
    }
    pipeTo(destination) {
        if (isPonyfillWritableStream(destination)) {
            return (0, promises_1.pipeline)(this.readable, destination.writable, {
                end: true,
            });
        }
        else {
            const writer = destination.getWriter();
            return this.pipeToWriter(writer);
        }
    }
    pipeThrough({ writable, readable, }) {
        this.pipeTo(writable).catch(err => {
            this.readable.destroy(err);
        });
        if (isPonyfillReadableStream(readable)) {
            readable.readable.once('error', err => this.readable.destroy(err));
            readable.readable.once('finish', () => this.readable.push(null));
            readable.readable.once('close', () => this.readable.push(null));
        }
        return readable;
    }
    static [Symbol.hasInstance](instance) {
        return isReadableStream(instance);
    }
    static from(iterable) {
        return new PonyfillReadableStream(node_stream_1.Readable.from(iterable));
    }
    [Symbol.toStringTag] = 'ReadableStream';
}
exports.PonyfillReadableStream = PonyfillReadableStream;
function isPonyfillReadableStream(obj) {
    return obj?.readable != null;
}
function isPonyfillWritableStream(obj) {
    return obj?.writable != null;
}
