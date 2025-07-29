"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillTransformStream = void 0;
const node_stream_1 = require("node:stream");
const ReadableStream_js_1 = require("./ReadableStream.js");
const utils_js_1 = require("./utils.js");
const WritableStream_js_1 = require("./WritableStream.js");
class PonyfillTransformStream {
    transform;
    writable;
    readable;
    constructor(transformer) {
        if (transformer instanceof node_stream_1.Transform) {
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
                    (0, utils_js_1.endStream)(transform);
                },
                get desiredSize() {
                    return transform.writableLength;
                },
            };
            const transform = new node_stream_1.Transform({
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
            this.transform = new node_stream_1.Transform();
        }
        this.writable = new WritableStream_js_1.PonyfillWritableStream(this.transform);
        this.readable = new ReadableStream_js_1.PonyfillReadableStream(this.transform);
    }
}
exports.PonyfillTransformStream = PonyfillTransformStream;
