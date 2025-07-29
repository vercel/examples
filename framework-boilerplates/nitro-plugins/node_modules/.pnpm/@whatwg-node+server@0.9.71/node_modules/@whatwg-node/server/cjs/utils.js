"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressedResponseMap = exports.iterateAsyncVoid = exports.nodeRequestResponseMap = exports.createDeferredPromise = exports.isPromise = void 0;
exports.isAsyncIterable = isAsyncIterable;
exports.normalizeNodeRequest = normalizeNodeRequest;
exports.isReadable = isReadable;
exports.isNodeRequest = isNodeRequest;
exports.isServerResponse = isServerResponse;
exports.isReadableStream = isReadableStream;
exports.isFetchEvent = isFetchEvent;
exports.sendNodeResponse = sendNodeResponse;
exports.isRequestInit = isRequestInit;
exports.completeAssign = completeAssign;
exports.handleErrorFromRequestHandler = handleErrorFromRequestHandler;
exports.isolateObject = isolateObject;
exports.handleAbortSignalAndPromiseResponse = handleAbortSignalAndPromiseResponse;
exports.getSupportedEncodings = getSupportedEncodings;
exports.handleResponseDecompression = handleResponseDecompression;
exports.ensureDisposableStackRegisteredForTerminateEvents = ensureDisposableStackRegisteredForTerminateEvents;
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
Object.defineProperty(exports, "createDeferredPromise", { enumerable: true, get: function () { return promise_helpers_1.createDeferredPromise; } });
Object.defineProperty(exports, "isPromise", { enumerable: true, get: function () { return promise_helpers_1.isPromise; } });
function isAsyncIterable(body) {
    return (body != null && typeof body === 'object' && typeof body[Symbol.asyncIterator] === 'function');
}
function getPort(nodeRequest) {
    if (nodeRequest.socket?.localPort) {
        return nodeRequest.socket?.localPort;
    }
    const hostInHeader = nodeRequest.headers?.[':authority'] || nodeRequest.headers?.host;
    const portInHeader = hostInHeader?.split(':')?.[1];
    if (portInHeader) {
        return portInHeader;
    }
    return 80;
}
function getHostnameWithPort(nodeRequest) {
    if (nodeRequest.headers?.[':authority']) {
        return nodeRequest.headers?.[':authority'];
    }
    if (nodeRequest.headers?.host) {
        return nodeRequest.headers?.host;
    }
    const port = getPort(nodeRequest);
    if (nodeRequest.hostname) {
        return nodeRequest.hostname + ':' + port;
    }
    const localIp = nodeRequest.socket?.localAddress;
    if (localIp && !localIp?.includes('::') && !localIp?.includes('ffff')) {
        return `${localIp}:${port}`;
    }
    return 'localhost';
}
function buildFullUrl(nodeRequest) {
    const hostnameWithPort = getHostnameWithPort(nodeRequest);
    const protocol = nodeRequest.protocol || (nodeRequest.socket?.encrypted ? 'https' : 'http');
    const endpoint = nodeRequest.originalUrl || nodeRequest.url || '/graphql';
    return `${protocol}://${hostnameWithPort}${endpoint}`;
}
function isRequestBody(body) {
    const stringTag = body[Symbol.toStringTag];
    if (typeof body === 'string' ||
        stringTag === 'Uint8Array' ||
        stringTag === 'Blob' ||
        stringTag === 'FormData' ||
        stringTag === 'URLSearchParams' ||
        isAsyncIterable(body)) {
        return true;
    }
    return false;
}
let bunNodeCompatModeWarned = false;
exports.nodeRequestResponseMap = new WeakMap();
function normalizeNodeRequest(nodeRequest, fetchAPI) {
    const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
    let fullUrl = buildFullUrl(rawRequest);
    if (nodeRequest.query) {
        const url = new fetchAPI.URL(fullUrl);
        for (const key in nodeRequest.query) {
            url.searchParams.set(key, nodeRequest.query[key]);
        }
        fullUrl = url.toString();
    }
    const nodeResponse = exports.nodeRequestResponseMap.get(nodeRequest);
    exports.nodeRequestResponseMap.delete(nodeRequest);
    let normalizedHeaders = nodeRequest.headers;
    if (nodeRequest.headers?.[':method']) {
        normalizedHeaders = {};
        for (const key in nodeRequest.headers) {
            if (!key.startsWith(':')) {
                normalizedHeaders[key] = nodeRequest.headers[key];
            }
        }
    }
    const controller = new AbortController();
    if (nodeResponse?.once) {
        const closeEventListener = () => {
            if (!controller.signal.aborted) {
                Object.defineProperty(rawRequest, 'aborted', { value: true });
                controller.abort(nodeResponse.errored ?? undefined);
            }
        };
        nodeResponse.once('error', closeEventListener);
        nodeResponse.once('close', closeEventListener);
        nodeResponse.once('finish', () => {
            nodeResponse.removeListener('close', closeEventListener);
        });
    }
    if (nodeRequest.method === 'GET' || nodeRequest.method === 'HEAD') {
        return new fetchAPI.Request(fullUrl, {
            method: nodeRequest.method,
            headers: normalizedHeaders,
            signal: controller.signal,
        });
    }
    /**
     * Some Node server frameworks like Serverless Express sends a dummy object with body but as a Buffer not string
     * so we do those checks to see is there something we can use directly as BodyInit
     * because the presence of body means the request stream is already consumed and,
     * rawRequest cannot be used as BodyInit/ReadableStream by Fetch API in this case.
     */
    const maybeParsedBody = nodeRequest.body;
    if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
        if (isRequestBody(maybeParsedBody)) {
            return new fetchAPI.Request(fullUrl, {
                method: nodeRequest.method || 'GET',
                headers: normalizedHeaders,
                body: maybeParsedBody,
                signal: controller.signal,
            });
        }
        const request = new fetchAPI.Request(fullUrl, {
            method: nodeRequest.method || 'GET',
            headers: normalizedHeaders,
            signal: controller.signal,
        });
        if (!request.headers.get('content-type')?.includes('json')) {
            request.headers.set('content-type', 'application/json; charset=utf-8');
        }
        return new Proxy(request, {
            get: (target, prop, receiver) => {
                switch (prop) {
                    case 'json':
                        return () => (0, promise_helpers_1.fakePromise)(maybeParsedBody);
                    case 'text':
                        return () => (0, promise_helpers_1.fakePromise)(JSON.stringify(maybeParsedBody));
                    default:
                        if (globalThis.Bun) {
                            // workaround for https://github.com/oven-sh/bun/issues/12368
                            // Proxy.get doesn't seem to get `receiver` correctly
                            return Reflect.get(target, prop);
                        }
                        return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
    // Temporary workaround for a bug in Bun Node compat mode
    if (globalThis.process?.versions?.bun && isReadable(rawRequest)) {
        if (!bunNodeCompatModeWarned) {
            bunNodeCompatModeWarned = true;
            console.warn(`You use Bun Node compatibility mode, which is not recommended!
It will affect your performance. Please check our Bun integration recipe, and avoid using 'http' for your server implementation.`);
        }
        return new fetchAPI.Request(fullUrl, {
            method: nodeRequest.method,
            headers: normalizedHeaders,
            duplex: 'half',
            body: new ReadableStream({
                start(controller) {
                    rawRequest.on('data', chunk => {
                        controller.enqueue(chunk);
                    });
                    rawRequest.on('error', e => {
                        controller.error(e);
                    });
                    rawRequest.on('end', () => {
                        controller.close();
                    });
                },
                cancel(e) {
                    rawRequest.destroy(e);
                },
            }),
            signal: controller.signal,
        });
    }
    // perf: instead of spreading the object, we can just pass it as is and it performs better
    return new fetchAPI.Request(fullUrl, {
        method: nodeRequest.method,
        headers: normalizedHeaders,
        signal: controller.signal,
        // @ts-expect-error - AsyncIterable is supported as body
        body: rawRequest,
        duplex: 'half',
    });
}
function isReadable(stream) {
    return stream.read != null;
}
function isNodeRequest(request) {
    return isReadable(request);
}
function isServerResponse(stream) {
    // Check all used functions are defined
    return (stream != null &&
        stream.setHeader != null &&
        stream.end != null &&
        stream.once != null &&
        stream.write != null);
}
function isReadableStream(stream) {
    return stream != null && stream.getReader != null;
}
function isFetchEvent(event) {
    return event != null && event.request != null && event.respondWith != null;
}
function configureSocket(rawRequest) {
    rawRequest?.socket?.setTimeout?.(0);
    rawRequest?.socket?.setNoDelay?.(true);
    rawRequest?.socket?.setKeepAlive?.(true);
}
function endResponse(serverResponse) {
    // @ts-expect-error Avoid arguments adaptor trampoline https://v8.dev/blog/adaptor-frame
    serverResponse.end(null, null, null);
}
async function sendAsyncIterable(serverResponse, asyncIterable) {
    let closed = false;
    const closeEventListener = () => {
        closed = true;
    };
    serverResponse.once('error', closeEventListener);
    serverResponse.once('close', closeEventListener);
    serverResponse.once('finish', () => {
        serverResponse.removeListener('close', closeEventListener);
    });
    for await (const chunk of asyncIterable) {
        if (closed) {
            break;
        }
        const shouldBreak = await new Promise(resolve => {
            if (!serverResponse
                // @ts-expect-error http and http2 writes are actually compatible
                .write(chunk, err => {
                if (err) {
                    resolve(true);
                }
            })) {
                if (closed) {
                    resolve(true);
                    return;
                }
                serverResponse.once('drain', () => {
                    resolve(false);
                });
            }
        });
        if (shouldBreak) {
            break;
        }
    }
    endResponse(serverResponse);
}
function sendNodeResponse(fetchResponse, serverResponse, nodeRequest) {
    if (serverResponse.closed || serverResponse.destroyed || serverResponse.writableEnded) {
        return;
    }
    if (!fetchResponse) {
        serverResponse.statusCode = 404;
        endResponse(serverResponse);
        return;
    }
    serverResponse.statusCode = fetchResponse.status;
    serverResponse.statusMessage = fetchResponse.statusText;
    let setCookiesSet = false;
    fetchResponse.headers.forEach((value, key) => {
        if (key === 'set-cookie') {
            if (setCookiesSet) {
                return;
            }
            setCookiesSet = true;
            const setCookies = fetchResponse.headers.getSetCookie?.();
            if (setCookies) {
                serverResponse.setHeader('set-cookie', setCookies);
                return;
            }
        }
        serverResponse.setHeader(key, value);
    });
    // Optimizations for node-fetch
    const bufOfRes = fetchResponse._buffer;
    if (bufOfRes) {
        // @ts-expect-error http and http2 writes are actually compatible
        serverResponse.write(bufOfRes);
        endResponse(serverResponse);
        return;
    }
    // Other fetch implementations
    const fetchBody = fetchResponse.body;
    if (fetchBody == null) {
        endResponse(serverResponse);
        return;
    }
    if (fetchBody[Symbol.toStringTag] === 'Uint8Array') {
        serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(fetchBody);
        endResponse(serverResponse);
        return;
    }
    configureSocket(nodeRequest);
    if (isReadable(fetchBody)) {
        serverResponse.once('close', () => {
            fetchBody.destroy();
        });
        fetchBody.pipe(serverResponse);
        return;
    }
    if (isReadableStream(fetchBody)) {
        return sendReadableStream(nodeRequest, serverResponse, fetchBody);
    }
    if (isAsyncIterable(fetchBody)) {
        return sendAsyncIterable(serverResponse, fetchBody);
    }
}
async function sendReadableStream(nodeRequest, serverResponse, readableStream) {
    const reader = readableStream.getReader();
    nodeRequest?.once?.('error', err => {
        reader.cancel(err);
    });
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        if (!serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(value)) {
            await new Promise(resolve => serverResponse.once('drain', resolve));
        }
    }
    endResponse(serverResponse);
}
function isRequestInit(val) {
    return (val != null &&
        typeof val === 'object' &&
        ('body' in val ||
            'cache' in val ||
            'credentials' in val ||
            'headers' in val ||
            'integrity' in val ||
            'keepalive' in val ||
            'method' in val ||
            'mode' in val ||
            'redirect' in val ||
            'referrer' in val ||
            'referrerPolicy' in val ||
            'signal' in val ||
            'window' in val));
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#copying_accessors
function completeAssign(...args) {
    const [target, ...sources] = args.filter(arg => arg != null && typeof arg === 'object');
    sources.forEach(source => {
        // modified Object.keys to Object.getOwnPropertyNames
        // because Object.keys only returns enumerable properties
        const descriptors = Object.getOwnPropertyNames(source).reduce((descriptors, key) => {
            const descriptor = Object.getOwnPropertyDescriptor(source, key);
            if (descriptor) {
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            }
            return descriptors;
        }, {});
        // By default, Object.assign copies enumerable Symbols, too
        Object.getOwnPropertySymbols(source).forEach(sym => {
            const descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor?.enumerable) {
                descriptors[sym] = descriptor;
            }
        });
        Object.defineProperties(target, descriptors);
    });
    return target;
}
var promise_helpers_2 = require("@whatwg-node/promise-helpers");
Object.defineProperty(exports, "iterateAsyncVoid", { enumerable: true, get: function () { return promise_helpers_2.iterateAsyncVoid; } });
function handleErrorFromRequestHandler(error, ResponseCtor) {
    return new ResponseCtor(error.stack || error.message || error.toString(), {
        status: error.status || 500,
    });
}
function isolateObject(originalCtx, waitUntilFn) {
    if (originalCtx == null) {
        if (waitUntilFn == null) {
            return {};
        }
        return {
            waitUntil: waitUntilFn,
        };
    }
    return completeAssign(Object.create(originalCtx), {
        waitUntil: waitUntilFn,
    }, originalCtx);
}
function handleAbortSignalAndPromiseResponse(response$, abortSignal) {
    if (abortSignal?.aborted) {
        throw abortSignal.reason;
    }
    if ((0, promise_helpers_1.isPromise)(response$) && abortSignal) {
        const deferred$ = (0, promise_helpers_1.createDeferredPromise)();
        function abortSignalFetchErrorHandler() {
            deferred$.reject(abortSignal.reason);
        }
        abortSignal.addEventListener('abort', abortSignalFetchErrorHandler, { once: true });
        response$
            .then(function fetchSuccessHandler(res) {
            deferred$.resolve(res);
        })
            .catch(function fetchErrorHandler(err) {
            deferred$.reject(err);
        })
            .finally(() => {
            abortSignal.removeEventListener('abort', abortSignalFetchErrorHandler);
        });
        return deferred$.promise;
    }
    return response$;
}
exports.decompressedResponseMap = new WeakMap();
const supportedEncodingsByFetchAPI = new WeakMap();
function getSupportedEncodings(fetchAPI) {
    let supportedEncodings = supportedEncodingsByFetchAPI.get(fetchAPI);
    if (!supportedEncodings) {
        const possibleEncodings = ['deflate', 'gzip', 'deflate-raw', 'br'];
        if (fetchAPI.DecompressionStream?.['supportedFormats']) {
            supportedEncodings = fetchAPI.DecompressionStream['supportedFormats'];
        }
        else {
            supportedEncodings = possibleEncodings.filter(encoding => {
                // deflate-raw is not supported in Node.js >v20
                if (globalThis.process?.version?.startsWith('v2') &&
                    fetchAPI.DecompressionStream === globalThis.DecompressionStream &&
                    encoding === 'deflate-raw') {
                    return false;
                }
                try {
                    // eslint-disable-next-line no-new
                    new fetchAPI.DecompressionStream(encoding);
                    return true;
                }
                catch {
                    return false;
                }
            });
        }
        supportedEncodingsByFetchAPI.set(fetchAPI, supportedEncodings);
    }
    return supportedEncodings;
}
function handleResponseDecompression(response, fetchAPI) {
    const contentEncodingHeader = response?.headers.get('content-encoding');
    if (!contentEncodingHeader || contentEncodingHeader === 'none') {
        return response;
    }
    if (!response?.body) {
        return response;
    }
    let decompressedResponse = exports.decompressedResponseMap.get(response);
    if (!decompressedResponse || decompressedResponse.bodyUsed) {
        let decompressedBody = response.body;
        const contentEncodings = contentEncodingHeader.split(',');
        if (!contentEncodings.every(encoding => getSupportedEncodings(fetchAPI).includes(encoding))) {
            return new fetchAPI.Response(`Unsupported 'Content-Encoding': ${contentEncodingHeader}`, {
                status: 415,
                statusText: 'Unsupported Media Type',
            });
        }
        for (const contentEncoding of contentEncodings) {
            decompressedBody = decompressedBody.pipeThrough(new fetchAPI.DecompressionStream(contentEncoding));
        }
        decompressedResponse = new fetchAPI.Response(decompressedBody, response);
        exports.decompressedResponseMap.set(response, decompressedResponse);
    }
    return decompressedResponse;
}
const terminateEvents = ['SIGINT', 'exit', 'SIGTERM'];
const disposableStacks = new Set();
let eventListenerRegistered = false;
function ensureEventListenerForDisposableStacks() {
    if (eventListenerRegistered) {
        return;
    }
    eventListenerRegistered = true;
    for (const event of terminateEvents) {
        globalThis.process.once(event, function terminateHandler() {
            return Promise.allSettled([...disposableStacks].map(stack => !stack.disposed && stack.disposeAsync()));
        });
    }
}
function ensureDisposableStackRegisteredForTerminateEvents(disposableStack) {
    if (globalThis.process) {
        ensureEventListenerForDisposableStacks();
        if (!disposableStacks.has(disposableStack)) {
            disposableStacks.add(disposableStack);
            disposableStack.defer(() => {
                disposableStacks.delete(disposableStack);
            });
        }
    }
}
