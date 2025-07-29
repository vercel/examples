import { AsyncDisposableStack, DisposableSymbols } from '@whatwg-node/disposablestack';
import * as DefaultFetchAPI from '@whatwg-node/fetch';
import { handleMaybePromise } from '@whatwg-node/promise-helpers';
import { completeAssign, ensureDisposableStackRegisteredForTerminateEvents, handleAbortSignalAndPromiseResponse, handleErrorFromRequestHandler, isFetchEvent, isNodeRequest, isolateObject, isPromise, isRequestInit, isServerResponse, iterateAsyncVoid, nodeRequestResponseMap, normalizeNodeRequest, sendNodeResponse, } from './utils.js';
import { fakePromise, getRequestFromUWSRequest, isUWSResponse, sendResponseToUwsOpts, } from './uwebsockets.js';
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
            _disposableStack = new AsyncDisposableStack();
            if (options?.disposeOnProcessTerminate) {
                ensureDisposableStackRegisteredForTerminateEvents(_disposableStack);
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
        if (isPromise(promiseLike)) {
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
            const disposeFn = plugin[DisposableSymbols.dispose];
            if (disposeFn) {
                ensureDisposableStack().defer(disposeFn);
            }
            const asyncDisposeFn = plugin[DisposableSymbols.asyncDispose];
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
                return handleMaybePromise(() => iterateAsyncVoid(onResponseHooks, onResponseHook => onResponseHook({
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
                    return handleMaybePromise(() => requestHandler(request, serverContext), handleResponse);
                }
                return handleResponse(response);
            }
            return handleMaybePromise(() => iterateAsyncVoid(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
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
        const serverContext = ctx.length > 1 ? completeAssign(...ctx) : ctx[0] || {};
        // Ensure `waitUntil` is available in the server context
        if (!serverContext.waitUntil) {
            serverContext.waitUntil = waitUntil;
        }
        const request = normalizeNodeRequest(nodeRequest, fetchAPI);
        return handleRequest(request, serverContext);
    }
    function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
        const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
        nodeRequestResponseMap.set(nodeRequest, nodeResponse);
        return handleNodeRequest(nodeRequest, ...ctx);
    }
    function requestListener(nodeRequest, nodeResponse, ...ctx) {
        const defaultServerContext = {
            req: nodeRequest,
            res: nodeResponse,
            waitUntil,
        };
        return handleMaybePromise(() => handleMaybePromise(() => handleNodeRequestAndResponse(nodeRequest, nodeResponse, defaultServerContext, ...ctx), response => response, err => handleErrorFromRequestHandler(err, fetchAPI.Response)), response => handleMaybePromise(() => sendNodeResponse(response, nodeResponse, nodeRequest), r => r, err => console.error(`Unexpected error while handling request: ${err.message || err}`)));
    }
    function handleUWS(res, req, ...ctx) {
        const defaultServerContext = {
            res,
            req,
            waitUntil,
        };
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? completeAssign(defaultServerContext, ...ctx)
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
        const request = getRequestFromUWSRequest({
            req,
            res,
            fetchAPI,
            controller,
        });
        return handleMaybePromise(() => handleMaybePromise(() => handleRequest(request, serverContext), response => response, err => handleErrorFromRequestHandler(err, fetchAPI.Response)), response => {
            if (!controller.signal.aborted && !resEnded) {
                return handleMaybePromise(() => sendResponseToUwsOpts(res, response, controller, fetchAPI), r => r, err => {
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
            ? completeAssign({}, event, ...filteredCtxParts)
            : isolateObject(event);
        const response$ = handleRequest(event.request, serverContext);
        event.respondWith(response$);
    }
    function handleRequestWithWaitUntil(request, ...ctx) {
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 1
            ? completeAssign({}, ...filteredCtxParts)
            : isolateObject(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null
                ? waitUntil
                : undefined);
        return handleRequest(request, serverContext);
    }
    const fetchFn = (input, ...maybeCtx) => {
        if (typeof input === 'string' || 'href' in input) {
            const [initOrCtx, ...restOfCtx] = maybeCtx;
            if (isRequestInit(initOrCtx)) {
                const request = new fetchAPI.Request(input, initOrCtx);
                const res$ = handleRequestWithWaitUntil(request, ...restOfCtx);
                const signal = initOrCtx.signal;
                if (signal) {
                    return handleAbortSignalAndPromiseResponse(res$, signal);
                }
                return res$;
            }
            const request = new fetchAPI.Request(input);
            return handleRequestWithWaitUntil(request, ...maybeCtx);
        }
        const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
        return handleAbortSignalAndPromiseResponse(res$, input.signal);
    };
    const genericRequestHandler = (input, ...maybeCtx) => {
        // If it is a Node request
        const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
        if (isNodeRequest(input)) {
            if (!isServerResponse(initOrCtxOrRes)) {
                throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
            }
            return requestListener(input, initOrCtxOrRes, ...restOfCtx);
        }
        if (isUWSResponse(input)) {
            return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
        }
        if (isServerResponse(initOrCtxOrRes)) {
            throw new TypeError('Got Node response without Node request');
        }
        // Is input a container object over Request?
        if (isRequestAccessible(input)) {
            // Is it FetchEvent?
            if (isFetchEvent(input)) {
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
        [DisposableSymbols.asyncDispose]() {
            if (_disposableStack && !_disposableStack.disposed) {
                return _disposableStack.disposeAsync();
            }
            return fakePromise();
        },
        dispose() {
            if (_disposableStack && !_disposableStack.disposed) {
                return _disposableStack.disposeAsync();
            }
            return fakePromise();
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
export { createServerAdapter };
