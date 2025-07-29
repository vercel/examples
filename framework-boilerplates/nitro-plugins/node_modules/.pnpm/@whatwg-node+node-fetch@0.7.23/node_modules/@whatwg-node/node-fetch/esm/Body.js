/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Buffer } from 'node:buffer';
import { addAbortSignal, Readable } from 'node:stream';
import { Busboy } from '@fastify/busboy';
import { handleMaybePromise } from '@whatwg-node/promise-helpers';
import { hasArrayBufferMethod, hasBufferMethod, hasBytesMethod, PonyfillBlob } from './Blob.js';
import { PonyfillFile } from './File.js';
import { getStreamFromFormData, PonyfillFormData } from './FormData.js';
import { PonyfillReadableStream } from './ReadableStream.js';
import { fakePromise, isArrayBufferView } from './utils.js';
var BodyInitType;
(function (BodyInitType) {
    BodyInitType["ReadableStream"] = "ReadableStream";
    BodyInitType["Blob"] = "Blob";
    BodyInitType["FormData"] = "FormData";
    BodyInitType["String"] = "String";
    BodyInitType["Readable"] = "Readable";
    BodyInitType["Buffer"] = "Buffer";
    BodyInitType["AsyncIterable"] = "AsyncIterable";
})(BodyInitType || (BodyInitType = {}));
export class PonyfillBody {
    bodyInit;
    options;
    bodyUsed = false;
    contentType = null;
    contentLength = null;
    constructor(bodyInit, options = {}) {
        this.bodyInit = bodyInit;
        this.options = options;
        const { bodyFactory, contentType, contentLength, bodyType, buffer } = processBodyInit(bodyInit);
        this._bodyFactory = bodyFactory;
        this.contentType = contentType;
        this.contentLength = contentLength;
        this.bodyType = bodyType;
        this._buffer = buffer;
        this._signal = options.signal;
    }
    bodyType;
    _bodyFactory = () => null;
    _generatedBody = null;
    _buffer;
    _signal;
    generateBody() {
        if (this._generatedBody?.readable?.destroyed && this._buffer) {
            this._generatedBody.readable = Readable.from(this._buffer);
        }
        if (this._generatedBody) {
            return this._generatedBody;
        }
        const body = this._bodyFactory();
        this._generatedBody = body;
        return body;
    }
    handleContentLengthHeader(forceSet = false) {
        const contentTypeInHeaders = this.headers.get('content-type');
        if (!contentTypeInHeaders) {
            if (this.contentType) {
                this.headers.set('content-type', this.contentType);
            }
        }
        else {
            this.contentType = contentTypeInHeaders;
        }
        const contentLengthInHeaders = this.headers.get('content-length');
        if (forceSet && this.bodyInit == null && !contentLengthInHeaders) {
            this.contentLength = 0;
            this.headers.set('content-length', '0');
        }
        if (!contentLengthInHeaders) {
            if (this.contentLength) {
                this.headers.set('content-length', this.contentLength.toString());
            }
        }
        else {
            this.contentLength = parseInt(contentLengthInHeaders, 10);
        }
    }
    get body() {
        const _body = this.generateBody();
        if (_body != null) {
            const ponyfillReadableStream = _body;
            const readable = _body.readable;
            return new Proxy(_body.readable, {
                get(_, prop) {
                    if (prop in ponyfillReadableStream) {
                        const ponyfillReadableStreamProp = ponyfillReadableStream[prop];
                        if (typeof ponyfillReadableStreamProp === 'function') {
                            return ponyfillReadableStreamProp.bind(ponyfillReadableStream);
                        }
                        return ponyfillReadableStreamProp;
                    }
                    if (prop in readable) {
                        const readableProp = readable[prop];
                        if (typeof readableProp === 'function') {
                            return readableProp.bind(readable);
                        }
                        return readableProp;
                    }
                },
            });
        }
        return null;
    }
    _chunks = null;
    _doCollectChunksFromReadableJob() {
        if (this.bodyType === BodyInitType.AsyncIterable) {
            if (Array.fromAsync) {
                return handleMaybePromise(() => Array.fromAsync(this.bodyInit), chunks => {
                    this._chunks = chunks;
                    return this._chunks;
                });
            }
            const iterator = this.bodyInit[Symbol.asyncIterator]();
            const chunks = [];
            const collectValue = () => handleMaybePromise(() => iterator.next(), ({ value, done }) => {
                if (value) {
                    chunks.push(value);
                }
                if (!done) {
                    return collectValue();
                }
                this._chunks = chunks;
                return this._chunks;
            });
            return collectValue();
        }
        const _body = this.generateBody();
        if (!_body) {
            this._chunks = [];
            return fakePromise(this._chunks);
        }
        if (_body.readable.destroyed) {
            return fakePromise((this._chunks = []));
        }
        const chunks = [];
        return new Promise((resolve, reject) => {
            _body.readable.on('data', chunk => {
                chunks.push(chunk);
            });
            _body.readable.once('error', reject);
            _body.readable.once('end', () => {
                resolve((this._chunks = chunks));
            });
        });
    }
    _collectChunksFromReadable() {
        if (this._chunks) {
            return fakePromise(this._chunks);
        }
        this._chunks ||= this._doCollectChunksFromReadableJob();
        return this._chunks;
    }
    _blob = null;
    blob() {
        if (this._blob) {
            return fakePromise(this._blob);
        }
        if (this.bodyType === BodyInitType.String) {
            this._text = this.bodyInit;
            this._blob = new PonyfillBlob([this._text], {
                type: this.contentType || 'text/plain;charset=UTF-8',
                size: this.contentLength,
            });
        }
        if (this.bodyType === BodyInitType.Blob) {
            this._blob = this.bodyInit;
            return fakePromise(this._blob);
        }
        if (this._buffer) {
            this._blob = new PonyfillBlob([this._buffer], {
                type: this.contentType || '',
                size: this.contentLength,
            });
            return fakePromise(this._blob);
        }
        return fakePromise(handleMaybePromise(() => this._collectChunksFromReadable(), chunks => {
            this._blob = new PonyfillBlob(chunks, {
                type: this.contentType || '',
                size: this.contentLength,
            });
            return this._blob;
        }));
    }
    _formData = null;
    formData(opts) {
        if (this._formData) {
            return fakePromise(this._formData);
        }
        if (this.bodyType === BodyInitType.FormData) {
            this._formData = this.bodyInit;
            return fakePromise(this._formData);
        }
        this._formData = new PonyfillFormData();
        const _body = this.generateBody();
        if (_body == null) {
            return fakePromise(this._formData);
        }
        const formDataLimits = {
            ...this.options.formDataLimits,
            ...opts?.formDataLimits,
        };
        return new Promise((resolve, reject) => {
            const stream = this.body?.readable;
            if (!stream) {
                return reject(new Error('No stream available'));
            }
            // form data file that is currently being processed, it's
            // important to keep track of it in case the stream ends early
            let currFile = null;
            const bb = new Busboy({
                headers: {
                    'content-length': typeof this.contentLength === 'number'
                        ? this.contentLength.toString()
                        : this.contentLength || '',
                    'content-type': this.contentType || '',
                },
                limits: formDataLimits,
                defCharset: 'utf-8',
            });
            if (this._signal) {
                addAbortSignal(this._signal, bb);
            }
            let completed = false;
            const complete = (err) => {
                if (completed)
                    return;
                completed = true;
                stream.unpipe(bb);
                bb.destroy();
                if (currFile) {
                    currFile.destroy();
                    currFile = null;
                }
                if (err) {
                    reject(err);
                }
                else {
                    // no error occured, this is a successful end/complete/finish
                    resolve(this._formData);
                }
            };
            // we dont need to listen to the stream close event because bb will close or error when necessary
            // stream.on('close', complete);
            // stream can be aborted, for example
            stream.on('error', complete);
            bb.on('field', (name, value, fieldnameTruncated, valueTruncated) => {
                if (fieldnameTruncated) {
                    return complete(new Error(`Field name size exceeded: ${formDataLimits?.fieldNameSize} bytes`));
                }
                if (valueTruncated) {
                    return complete(new Error(`Field value size exceeded: ${formDataLimits?.fieldSize} bytes`));
                }
                this._formData.set(name, value);
            });
            bb.on('file', (name, fileStream, filename, _transferEncoding, mimeType) => {
                currFile = fileStream;
                const chunks = [];
                fileStream.on('data', chunk => {
                    chunks.push(chunk);
                });
                fileStream.on('error', complete);
                fileStream.on('limit', () => {
                    complete(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
                });
                fileStream.on('close', () => {
                    if (fileStream.truncated) {
                        complete(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
                    }
                    currFile = null;
                    const file = new PonyfillFile(chunks, filename, { type: mimeType });
                    this._formData.set(name, file);
                });
            });
            bb.on('fieldsLimit', () => {
                complete(new Error(`Fields limit exceeded: ${formDataLimits?.fields}`));
            });
            bb.on('filesLimit', () => {
                complete(new Error(`Files limit exceeded: ${formDataLimits?.files}`));
            });
            bb.on('partsLimit', () => {
                complete(new Error(`Parts limit exceeded: ${formDataLimits?.parts}`));
            });
            bb.on('end', complete);
            bb.on('finish', complete);
            bb.on('close', complete);
            bb.on('error', complete);
            stream.pipe(bb);
        });
    }
    buffer() {
        if (this._buffer) {
            return fakePromise(this._buffer);
        }
        if (this._text) {
            this._buffer = Buffer.from(this._text, 'utf-8');
            return fakePromise(this._buffer);
        }
        if (this.bodyType === BodyInitType.String) {
            return this.text().then(text => {
                this._text = text;
                this._buffer = Buffer.from(text, 'utf-8');
                return this._buffer;
            });
        }
        if (this.bodyType === BodyInitType.Blob) {
            if (hasBufferMethod(this.bodyInit)) {
                return this.bodyInit.buffer().then(buf => {
                    this._buffer = buf;
                    return this._buffer;
                });
            }
            if (hasBytesMethod(this.bodyInit)) {
                return this.bodyInit.bytes().then(bytes => {
                    this._buffer = Buffer.from(bytes);
                    return this._buffer;
                });
            }
            if (hasArrayBufferMethod(this.bodyInit)) {
                return this.bodyInit.arrayBuffer().then(buf => {
                    this._buffer = Buffer.from(buf, undefined, buf.byteLength);
                    return this._buffer;
                });
            }
        }
        return fakePromise(handleMaybePromise(() => this._collectChunksFromReadable(), chunks => {
            if (chunks.length === 1) {
                this._buffer = chunks[0];
                return this._buffer;
            }
            this._buffer = Buffer.concat(chunks);
            return this._buffer;
        }));
    }
    bytes() {
        return this.buffer();
    }
    arrayBuffer() {
        // @ts-ignore - Mismatch between Buffer and ArrayBuffer
        return this.buffer();
    }
    _json = null;
    json() {
        if (this._json) {
            return fakePromise(this._json);
        }
        return this.text().then(text => {
            try {
                this._json = JSON.parse(text);
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    e.message += `, "${text}" is not valid JSON`;
                }
                throw e;
            }
            return this._json;
        });
    }
    _text = null;
    text() {
        if (this._text) {
            return fakePromise(this._text);
        }
        if (this.bodyType === BodyInitType.String) {
            this._text = this.bodyInit;
            return fakePromise(this._text);
        }
        return this.buffer().then(buffer => {
            this._text = buffer.toString('utf-8');
            return this._text;
        });
    }
}
function processBodyInit(bodyInit) {
    if (bodyInit == null) {
        return {
            bodyFactory: () => null,
            contentType: null,
            contentLength: null,
        };
    }
    if (typeof bodyInit === 'string') {
        const contentLength = Buffer.byteLength(bodyInit);
        return {
            bodyType: BodyInitType.String,
            contentType: 'text/plain;charset=UTF-8',
            contentLength,
            bodyFactory() {
                const readable = Readable.from(Buffer.from(bodyInit, 'utf-8'));
                return new PonyfillReadableStream(readable);
            },
        };
    }
    if (Buffer.isBuffer(bodyInit)) {
        const buffer = bodyInit;
        return {
            bodyType: BodyInitType.Buffer,
            contentType: null,
            contentLength: bodyInit.length,
            buffer: bodyInit,
            bodyFactory() {
                const readable = Readable.from(buffer);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (isArrayBufferView(bodyInit)) {
        const buffer = Buffer.from(bodyInit.buffer, bodyInit.byteOffset, bodyInit.byteLength);
        return {
            bodyType: BodyInitType.Buffer,
            contentLength: bodyInit.byteLength,
            contentType: null,
            buffer,
            bodyFactory() {
                const readable = Readable.from(buffer);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof PonyfillReadableStream && bodyInit.readable != null) {
        const readableStream = bodyInit;
        return {
            bodyType: BodyInitType.ReadableStream,
            bodyFactory: () => readableStream,
            contentType: null,
            contentLength: null,
        };
    }
    if (isBlob(bodyInit)) {
        const blob = bodyInit;
        return {
            bodyType: BodyInitType.Blob,
            contentType: bodyInit.type,
            contentLength: bodyInit.size,
            bodyFactory() {
                return blob.stream();
            },
        };
    }
    if (bodyInit instanceof ArrayBuffer) {
        const contentLength = bodyInit.byteLength;
        const buffer = Buffer.from(bodyInit, undefined, bodyInit.byteLength);
        return {
            bodyType: BodyInitType.Buffer,
            contentType: null,
            contentLength,
            buffer,
            bodyFactory() {
                const readable = Readable.from(buffer);
                const body = new PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof Readable) {
        return {
            bodyType: BodyInitType.Readable,
            contentType: null,
            contentLength: null,
            bodyFactory() {
                const body = new PonyfillReadableStream(bodyInit);
                return body;
            },
        };
    }
    if (isURLSearchParams(bodyInit)) {
        const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        return {
            bodyType: BodyInitType.String,
            contentType,
            contentLength: null,
            bodyFactory() {
                const body = new PonyfillReadableStream(Readable.from(bodyInit.toString()));
                return body;
            },
        };
    }
    if (isFormData(bodyInit)) {
        const boundary = Math.random().toString(36).substr(2);
        const contentType = `multipart/form-data; boundary=${boundary}`;
        return {
            bodyType: BodyInitType.FormData,
            contentType,
            contentLength: null,
            bodyFactory() {
                return getStreamFromFormData(bodyInit, boundary);
            },
        };
    }
    if (isReadableStream(bodyInit)) {
        return {
            contentType: null,
            contentLength: null,
            bodyFactory() {
                return new PonyfillReadableStream(bodyInit);
            },
        };
    }
    if (bodyInit[Symbol.iterator] || bodyInit[Symbol.asyncIterator]) {
        return {
            contentType: null,
            contentLength: null,
            bodyType: BodyInitType.AsyncIterable,
            bodyFactory() {
                const readable = Readable.from(bodyInit);
                return new PonyfillReadableStream(readable);
            },
        };
    }
    throw new Error('Unknown body type');
}
function isFormData(value) {
    return value?.forEach != null;
}
function isBlob(value) {
    return value?.stream != null && typeof value.stream === 'function';
}
function isURLSearchParams(value) {
    return value?.sort != null;
}
function isReadableStream(value) {
    return value?.getReader != null;
}
