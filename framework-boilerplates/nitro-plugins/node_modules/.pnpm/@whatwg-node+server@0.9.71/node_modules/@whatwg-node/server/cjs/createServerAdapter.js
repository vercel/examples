"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerAdapter = createServerAdapter;
const tslib_1 = require("tslib");
const disposablestack_1 = require("@whatwg-node/disposablestack");
const DefaultFetchAPI = tslib_1.__importStar(require("@whatwg-node/fetch"));
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
const utils_js_1 = require("./utils.js");
const uwebsockets_js_1 = require("./uwebsockets.js");
// Required for envs like nextjs edge runtime
function isRequestAccessible(serverContext) {
    try {
        return !!serverContext?.request;
    }
    catch {
        return false;
    }
}
const EMPTY_OBJECT = {};
function createServerAdapter(serverAdapterBaseObject, options) {
    const fetchAPI = {
        ...DefaultFetchAPI,
        ...options?.fetchAPI,
    };
    const givenHandleRequest = typeof serverAdapterBaseObject === 'function'
        ? serverAdapterBaseObject
        : serverAdapterBaseObject.handle;
    const onRequestHooks = [];
    const onResponseHooks = [];
    const waitUntilPromises = new Set();
    let _disposableStack;
    function ensureDisposableStack() {
        if (!_disposableStack) {
            _disposableStack = new disposablestack_1.AsyncDisposableStack();
            if (options?.disposeOnProcessTerminate) {
                (0, utils_js_1.ensureDisposableStackRegisteredForTerminateEvents)(_disposableStack);
            }
            _disposableStack.defer(() => {
                if (waitUntilPromises.size > 0) {
                    return Promise.allSettled(waitUntilPromises).then(() => {
                        waitUntilPromises.clear();
                    }, () => {
                        waitUntilPromises.clear();
                    });
                }
            });
        }
        return _disposableStack;
    }
    function waitUntil(promiseLike) {
        // Ensure that the disposable stack is created
        if ((0, utils_js_1.isPromise)(promiseLike)) {
            ensureDisposableStack();
            waitUntilPromises.add(promiseLike);
            promiseLike.then(() => {
                waitUntilPromises.delete(promiseLike);
            }, err => {
                console.error(`Unexpected error while waiting: ${err.message || err}`);
                waitUntilPromises.delete(promiseLike);
            });
        }
    }
    if (options?.plugins != null) {
        for (const plugin of options.plugins) {
            if (plugin.onRequest) {
                onRequestHooks.push(plugin.onRequest);
            }
            if (plugin.onResponse) {
                onResponseHooks.push(plugin.onResponse);
            }
            const disposeFn = plugin[disposablestack_1.DisposableSymbols.dispose];
            if (disposeFn) {
                ensureDisposableStack().defer(disposeFn);
            }
            const asyncDisposeFn = plugin[disposablestack_1.DisposableSymbols.asyncDispose];
            if (asyncDisposeFn) {
                ensureDisposableStack().defer(asyncDisposeFn);
            }
            if (plugin.onDispose) {
                ensureDisposableStack().defer(plugin.onDispose);
            }
        }
    }
    const handleRequest = onRequestHooks.length > 0 || onResponseHooks.length > 0
        ? function handleRequest(request, serverContext) {
            let requestHandler = givenHandleRequest;
            let response;
            if (onRequestHooks.length === 0) {
                return handleEarlyResponse();
            }
            let url = request['parsedUrl'] ||
                new Proxy(EMPTY_OBJECT, {
                    get(_target, prop, _receiver) {
                        url = new fetchAPI.URL(request.url, 'http://localhost');
                        return Reflect.get(url, prop, url);
                    },
                });
            function handleResponse(response) {
                if (onResponseHooks.length === 0) {
                    return response;
                }
                return (0, promise_helpers_1.handleMaybePromise)(() => (0, utils_js_1.iterateAsyncVoid)(onResponseHooks, onResponseHook => onResponseHook({
                    request,
                    response,
                    serverContext,
                    setResponse(newResponse) {
                        response = newResponse;
                    },
                    fetchAPI,
                })), () => response);
            }
            function handleEarlyResponse() {
                if (!response) {
                    return (0, promise_helpers_1.handleMaybePromise)(() => requestHandler(request, serverContext), handleResponse);
                }
                return handleResponse(response);
            }
            return (0, promise_helpers_1.handleMaybePromise)(() => (0, utils_js_1.iterateAsyncVoid)(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
                request,
                setRequest(newRequest) {
                    request = newRequest;
                },
                serverContext,
                fetchAPI,
                url,
                requestHandler,
                setRequestHandler(newRequestHandler) {
                    requestHandler = newRequestHandler;
                },
                endResponse(newResponse) {
                    response = newResponse;
                    if (newResponse) {
                        stopEarly();
                    }
                },
            })), handleEarlyResponse);
        }
        : givenHandleRequest;
    // TODO: Remove this on the next major version
    function handleNodeRequest(nodeRequest, ...ctx) {
        const serverContext = ctx.length > 1 ? (0, utils_js_1.completeAssign)(...ctx) : ctx[0] || {};
        // Ensure `waitUntil` is available in the server context
        if (!serverContext.waitUntil) {
            serverContext.waitUntil = waitUntil;
        }
        const request = (0, utils_js_1.normalizeNodeRequest)(nodeRequest, fetchAPI);
        return handleRequest(request, serverContext);
    }
    function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
        const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
        utils_js_1.nodeRequestResponseMap.set(nodeRequest, nodeResponse);
        return handleNodeRequest(nodeRequest, ...ctx);
    }
    function requestListener(nodeRequest, nodeResponse, ...ctx) {
        const defaultServerContext = {
            req: nodeRequest,
            res: nodeResponse,
            waitUntil,
        };
        return (0, promise_helpers_1.handleMaybePromise)(() => (0, promise_helpers_1.handleMaybePromise)(() => handleNodeRequestAndResponse(nodeRequest, nodeResponse, defaultServerContext, ...ctx), response => response, err => (0, utils_js_1.handleErrorFromRequestHandler)(err, fetchAPI.Response)), response => (0, promise_helpers_1.handleMaybePromise)(() => (0, utils_js_1.sendNodeResponse)(response, nodeResponse, nodeRequest), r => r, err => console.error(`Unexpected error while handling request: ${err.message || err}`)));
    }
    function handleUWS(res, req, ...ctx) {
        const defaultServerContext = {
            res,
            req,
            waitUntil,
        };
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? (0, utils_js_1.completeAssign)(defaultServerContext, ...ctx)
            : defaultServerContext;
        const controller = new AbortController();
        const originalResEnd = res.end.bind(res);
        let resEnded = false;
        res.end = function (data) {
            resEnded = true;
            return originalResEnd(data);
        };
        const originalOnAborted = res.onAborted.bind(res);
        originalOnAborted(function () {
            controller.abort();
        });
        res.onAborted = function (cb) {
            controller.signal.addEventListener('abort', cb, { once: true });
        };
        const request = (0, uwebsockets_js_1.getRequestFromUWSRequest)({
            req,
            res,
            fetchAPI,
            controller,
        });
        return (0, promise_helpers_1.handleMaybePromise)(() => (0, promise_helpers_1.handleMaybePromise)(() => handleRequest(request, serverContext), response => response, err => (0, utils_js_1.handleErrorFromRequestHandler)(err, fetchAPI.Response)), response => {
            if (!controller.signal.aborted && !resEnded) {
                return (0, promise_helpers_1.handleMaybePromise)(() => (0, uwebsockets_js_1.sendResponseToUwsOpts)(res, response, controller, fetchAPI), r => r, err => {
                    console.error(`Unexpected error while handling request: ${err.message || err}`);
                });
            }
        });
    }
    function handleEvent(event, ...ctx) {
        if (!event.respondWith || !event.request) {
            throw new TypeError(`Expected FetchEvent, got ${event}`);
        }
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? (0, utils_js_1.completeAssign)({}, event, ...filteredCtxParts)
            : (0, utils_js_1.isolateObject)(event);
        const response$ = handleRequest(event.request, serverContext);
        event.respondWith(response$);
    }
    function handleRequestWithWaitUntil(request, ...ctx) {
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 1
            ? (0, utils_js_1.completeAssign)({}, ...filteredCtxParts)
            : (0, utils_js_1.isolateObject)(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null
                ? waitUntil
                : undefined);
        return handleRequest(request, serverContext);
    }
    const fetchFn = (input, ...maybeCtx) => {
        if (typeof input === 'string' || 'href' in input) {
            const [initOrCtx, ...restOfCtx] = maybeCtx;
            if ((0, utils_js_1.isRequestInit)(initOrCtx)) {
                const request = new fetchAPI.Request(input, initOrCtx);
                const res$ = handleRequestWithWaitUntil(request, ...restOfCtx);
                const signal = initOrCtx.signal;
                if (signal) {
                    return (0, utils_js_1.handleAbortSignalAndPromiseResponse)(res$, signal);
                }
                return res$;
            }
            const request = new fetchAPI.Request(input);
            return handleRequestWithWaitUntil(request, ...maybeCtx);
        }
        const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
        return (0, utils_js_1.handleAbortSignalAndPromiseResponse)(res$, input.signal);
    };
    const genericRequestHandler = (input, ...maybeCtx) => {
        // If it is a Node request
        const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
        if ((0, utils_js_1.isNodeRequest)(input)) {
            if (!(0, utils_js_1.isServerResponse)(initOrCtxOrRes)) {
                throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
            }
            return requestListener(input, initOrCtxOrRes, ...restOfCtx);
        }
        if ((0, uwebsockets_js_1.isUWSResponse)(input)) {
            return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
        }
        if ((0, utils_js_1.isServerResponse)(initOrCtxOrRes)) {
            throw new TypeError('Got Node response without Node request');
        }
        // Is input a container object over Request?
        if (isRequestAccessible(input)) {
            // Is it FetchEvent?
            if ((0, utils_js_1.isFetchEvent)(input)) {
                return handleEvent(input, ...maybeCtx);
            }
            // In this input is also the context
            return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
        }
        // Or is it Request itself?
        // Then ctx is present and it is the context
        return fetchFn(input, ...maybeCtx);
    };
    const adapterObj = {
        handleRequest: handleRequestWithWaitUntil,
        fetch: fetchFn,
        handleNodeRequest,
        handleNodeRequestAndResponse,
        requestListener,
        handleEvent,
        handleUWS,
        handle: genericRequestHandler,
        get disposableStack() {
            return ensureDisposableStack();
        },
        [disposablestack_1.DisposableSymbols.asyncDispose]() {
            if (_disposableStack && !_disposableStack.disposed) {
                return _disposableStack.disposeAsync();
            }
            return (0, uwebsockets_js_1.fakePromise)();
        },
        dispose() {
            if (_disposableStack && !_disposableStack.disposed) {
                return _disposableStack.disposeAsync();
            }
            return (0, uwebsockets_js_1.fakePromise)();
        },
    };
    const serverAdapter = new Proxy(genericRequestHandler, {
        // It should have all the attributes of the handler function and the server instance
        has: (_, prop) => {
            return (prop in adapterObj ||
                prop in genericRequestHandler ||
                (serverAdapterBaseObject && prop in serverAdapterBaseObject));
        },
        get: (_, prop) => {
            const adapterProp = adapterObj[prop];
            if (adapterProp) {
                if (adapterProp.bind) {
                    return adapterProp.bind(adapterObj);
                }
                return adapterProp;
            }
            const handleProp = genericRequestHandler[prop];
            if (handleProp) {
                if (handleProp.bind) {
                    return handleProp.bind(genericRequestHandler);
                }
                return handleProp;
            }
            if (serverAdapterBaseObject) {
                const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
                if (serverAdapterBaseObjectProp) {
                    if (serverAdapterBaseObjectProp.bind) {
                        return function (...args) {
                            const returnedVal = serverAdapterBaseObject[prop](...args);
                            if (returnedVal === serverAdapterBaseObject) {
                                return serverAdapter;
                            }
                            return returnedVal;
                        };
                    }
                    return serverAdapterBaseObjectProp;
                }
            }
        },
        apply(_, __, args) {
            return genericRequestHandler(...args);
        },
    });
    return serverAdapter;
}
