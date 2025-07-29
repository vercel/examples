/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Buffer } from 'node:buffer';
import { PonyfillReadableStream } from './ReadableStream.js';
import { fakePromise, isArrayBufferView } from './utils.js';
function getBlobPartAsBuffer(blobPart) {
    if (typeof blobPart === 'string') {
        return Buffer.from(blobPart);
    }
    else if (Buffer.isBuffer(blobPart)) {
        return blobPart;
    }
    else if (isArrayBufferView(blobPart)) {
        return Buffer.from(blobPart.buffer, blobPart.byteOffset, blobPart.byteLength);
    }
    else {
        return Buffer.from(blobPart);
    }
}
export function hasBufferMethod(obj) {
    return obj != null && obj.buffer != null && typeof obj.buffer === 'function';
}
export function hasArrayBufferMethod(obj) {
    return obj != null && obj.arrayBuffer != null && typeof obj.arrayBuffer === 'function';
}
export function hasBytesMethod(obj) {
    return obj != null && obj.bytes != null && typeof obj.bytes === 'function';
}
export function hasTextMethod(obj) {
    return obj != null && obj.text != null && typeof obj.text === 'function';
}
export function hasSizeProperty(obj) {
    return obj != null && typeof obj.size === 'number';
}
export function hasStreamMethod(obj) {
    return obj != null && obj.stream != null && typeof obj.stream === 'function';
}
export function hasBlobSignature(obj) {
    return obj != null && obj[Symbol.toStringTag] === 'Blob';
}
export function isArrayBuffer(obj) {
    return obj != null && obj.byteLength != null && obj.slice != null;
}
// Will be removed after v14 reaches EOL
// Needed because v14 doesn't have .stream() implemented
export class PonyfillBlob {
    blobParts;
    type;
    encoding;
    _size = null;
    constructor(blobParts = [], options) {
        this.blobParts = blobParts;
        this.type = options?.type || 'application/octet-stream';
        this.encoding = options?.encoding || 'utf8';
        this._size = options?.size || null;
        if (blobParts.length === 1 && hasBlobSignature(blobParts[0])) {
            return blobParts[0];
        }
    }
    _buffer = null;
    buffer() {
        if (this._buffer) {
            return fakePromise(this._buffer);
        }
        if (this.blobParts.length === 1) {
            const blobPart = this.blobParts[0];
            if (hasBufferMethod(blobPart)) {
                return blobPart.buffer().then(buf => {
                    this._buffer = buf;
                    return this._buffer;
                });
            }
            if (hasBytesMethod(blobPart)) {
                return blobPart.bytes().then(bytes => {
                    this._buffer = Buffer.from(bytes);
                    return this._buffer;
                });
            }
            if (hasArrayBufferMethod(blobPart)) {
                return blobPart.arrayBuffer().then(arrayBuf => {
                    this._buffer = Buffer.from(arrayBuf, undefined, blobPart.size);
                    return this._buffer;
                });
            }
            this._buffer = getBlobPartAsBuffer(blobPart);
            return fakePromise(this._buffer);
        }
        const jobs = [];
        const bufferChunks = this.blobParts.map((blobPart, i) => {
            if (hasBufferMethod(blobPart)) {
                jobs.push(blobPart.buffer().then(buf => {
                    bufferChunks[i] = buf;
                }));
                return undefined;
            }
            else if (hasArrayBufferMethod(blobPart)) {
                jobs.push(blobPart.arrayBuffer().then(arrayBuf => {
                    bufferChunks[i] = Buffer.from(arrayBuf, undefined, blobPart.size);
                }));
                return undefined;
            }
            else if (hasBytesMethod(blobPart)) {
                jobs.push(blobPart.bytes().then(bytes => {
                    bufferChunks[i] = Buffer.from(bytes);
                }));
                return undefined;
            }
            else {
                return getBlobPartAsBuffer(blobPart);
            }
        });
        if (jobs.length > 0) {
            return Promise.all(jobs).then(() => Buffer.concat(bufferChunks, this._size || undefined));
        }
        return fakePromise(Buffer.concat(bufferChunks, this._size || undefined));
    }
    arrayBuffer() {
        if (this._buffer) {
            // @ts-ignore - Mismatch between Buffer and ArrayBuffer
            return fakePromise(this._buffer);
        }
        if (this.blobParts.length === 1) {
            if (isArrayBuffer(this.blobParts[0])) {
                return fakePromise(this.blobParts[0]);
            }
            if (hasArrayBufferMethod(this.blobParts[0])) {
                return this.blobParts[0].arrayBuffer();
            }
        }
        // @ts-ignore - Mismatch between Buffer and ArrayBuffer
        return this.buffer();
    }
    bytes() {
        if (this._buffer) {
            return fakePromise(this._buffer);
        }
        if (this.blobParts.length === 1) {
            if (Buffer.isBuffer(this.blobParts[0])) {
                this._buffer = this.blobParts[0];
                return fakePromise(this.blobParts[0]);
            }
            if (this.blobParts[0] instanceof Uint8Array) {
                this._buffer = Buffer.from(this.blobParts[0]);
                return fakePromise(this.blobParts[0]);
            }
            if (hasBytesMethod(this.blobParts[0])) {
                return this.blobParts[0].bytes();
            }
            if (hasBufferMethod(this.blobParts[0])) {
                return this.blobParts[0].buffer();
            }
        }
        return this.buffer();
    }
    _text = null;
    text() {
        if (this._text) {
            return fakePromise(this._text);
        }
        if (this.blobParts.length === 1) {
            const blobPart = this.blobParts[0];
            if (typeof blobPart === 'string') {
                this._text = blobPart;
                return fakePromise(this._text);
            }
            if (hasTextMethod(blobPart)) {
                return blobPart.text().then(text => {
                    this._text = text;
                    return this._text;
                });
            }
            const buf = getBlobPartAsBuffer(blobPart);
            this._text = buf.toString(this.encoding);
            return fakePromise(this._text);
        }
        return this.buffer().then(buf => {
            this._text = buf.toString(this.encoding);
            return this._text;
        });
    }
    _json = null;
    json() {
        if (this._json) {
            return fakePromise(this._json);
        }
        return this.text().then(text => {
            this._json = JSON.parse(text);
            return this._json;
        });
    }
    _formData = null;
    formData() {
        if (this._formData) {
            return fakePromise(this._formData);
        }
        throw new Error('Not implemented');
    }
    get size() {
        if (this._size == null) {
            this._size = 0;
            for (const blobPart of this.blobParts) {
                if (typeof blobPart === 'string') {
                    this._size += Buffer.byteLength(blobPart);
                }
                else if (hasSizeProperty(blobPart)) {
                    this._size += blobPart.size;
                }
                else if (isArrayBufferView(blobPart)) {
                    this._size += blobPart.byteLength;
                }
            }
        }
        return this._size;
    }
    stream() {
        if (this.blobParts.length === 1) {
            const blobPart = this.blobParts[0];
            if (hasStreamMethod(blobPart)) {
                return blobPart.stream();
            }
            const buf = getBlobPartAsBuffer(blobPart);
            return new PonyfillReadableStream({
                start: controller => {
                    controller.enqueue(buf);
                    controller.close();
                },
            });
        }
        if (this._buffer != null) {
            return new PonyfillReadableStream({
                start: controller => {
                    controller.enqueue(this._buffer);
                    controller.close();
                },
            });
        }
        let blobPartIterator;
        return new PonyfillReadableStream({
            start: controller => {
                if (this.blobParts.length === 0) {
                    controller.close();
                    return;
                }
                blobPartIterator = this.blobParts[Symbol.iterator]();
            },
            pull: controller => {
                const { value: blobPart, done } = blobPartIterator.next();
                if (done) {
                    controller.close();
                    return;
                }
                if (blobPart) {
                    if (hasBufferMethod(blobPart)) {
                        return blobPart.buffer().then(buf => {
                            controller.enqueue(buf);
                        });
                    }
                    if (hasBytesMethod(blobPart)) {
                        return blobPart.bytes().then(bytes => {
                            const buf = Buffer.from(bytes);
                            controller.enqueue(buf);
                        });
                    }
                    if (hasArrayBufferMethod(blobPart)) {
                        return blobPart.arrayBuffer().then(arrayBuffer => {
                            const buf = Buffer.from(arrayBuffer, undefined, blobPart.size);
                            controller.enqueue(buf);
                        });
                    }
                    const buf = getBlobPartAsBuffer(blobPart);
                    controller.enqueue(buf);
                }
            },
        });
    }
    slice() {
        throw new Error('Not implemented');
    }
}
