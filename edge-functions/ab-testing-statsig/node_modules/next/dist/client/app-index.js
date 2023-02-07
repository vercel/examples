"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hydrate = hydrate;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
require("../build/polyfills/polyfill-module");
var _client = _interop_require_default(require("react-dom/client"));
var _react = _interop_require_wildcard(require("react"));
var _client1 = require("next/dist/compiled/react-server-dom-webpack/client");
var _headManagerContext = require("../shared/lib/head-manager-context");
var _appRouterContext = require("../shared/lib/app-router-context");
var _noSsrError = require("../shared/lib/no-ssr-error");
// eslint-disable-next-line no-undef
const getChunkScriptFilename = __webpack_require__.u;
const chunkFilenameMap = {};
// eslint-disable-next-line no-undef
__webpack_require__.u = (chunkId)=>{
    return chunkFilenameMap[chunkId] || getChunkScriptFilename(chunkId);
};
// Ignore the module ID transform in client.
// eslint-disable-next-line no-undef
// @ts-expect-error TODO: fix type
self.__next_require__ = process.env.NODE_ENV !== 'production' ? (id)=>{
    const mod = __webpack_require__(id);
    if (typeof mod === 'object') {
        // Return a proxy to flight client to make sure it's always getting
        // the latest module, instead of being cached.
        return new Proxy(mod, {
            get (_target, prop) {
                return __webpack_require__(id)[prop];
            }
        });
    }
    return mod;
} : __webpack_require__;
self.__next_chunk_load__ = (chunk)=>{
    if (!chunk) return Promise.resolve();
    const [chunkId, chunkFileName] = chunk.split(':');
    chunkFilenameMap[chunkId] = `static/chunks/${chunkFileName}.js`;
    // @ts-ignore
    // eslint-disable-next-line no-undef
    return __webpack_chunk_load__(chunkId);
};
const appElement = document;
const getCacheKey = ()=>{
    const { pathname , search  } = location;
    return pathname + search;
};
const encoder = new TextEncoder();
let initialServerDataBuffer = undefined;
let initialServerDataWriter = undefined;
let initialServerDataLoaded = false;
let initialServerDataFlushed = false;
function nextServerDataCallback(seg) {
    if (seg[0] === 0) {
        initialServerDataBuffer = [];
    } else {
        if (!initialServerDataBuffer) throw new Error('Unexpected server data: missing bootstrap script.');
        if (initialServerDataWriter) {
            initialServerDataWriter.enqueue(encoder.encode(seg[1]));
        } else {
            initialServerDataBuffer.push(seg[1]);
        }
    }
}
// There might be race conditions between `nextServerDataRegisterWriter` and
// `DOMContentLoaded`. The former will be called when React starts to hydrate
// the root, the latter will be called when the DOM is fully loaded.
// For streaming, the former is called first due to partial hydration.
// For non-streaming, the latter can be called first.
// Hence, we use two variables `initialServerDataLoaded` and
// `initialServerDataFlushed` to make sure the writer will be closed and
// `initialServerDataBuffer` will be cleared in the right time.
function nextServerDataRegisterWriter(ctr) {
    if (initialServerDataBuffer) {
        initialServerDataBuffer.forEach((val)=>{
            ctr.enqueue(encoder.encode(val));
        });
        if (initialServerDataLoaded && !initialServerDataFlushed) {
            ctr.close();
            initialServerDataFlushed = true;
            initialServerDataBuffer = undefined;
        }
    }
    initialServerDataWriter = ctr;
}
// When `DOMContentLoaded`, we can close all pending writers to finish hydration.
const DOMContentLoaded = function() {
    if (initialServerDataWriter && !initialServerDataFlushed) {
        initialServerDataWriter.close();
        initialServerDataFlushed = true;
        initialServerDataBuffer = undefined;
    }
    initialServerDataLoaded = true;
};
// It's possible that the DOM is already loaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
} else {
    DOMContentLoaded();
}
function onRecoverableError(err) {
    // Using default react onRecoverableError
    // x-ref: https://github.com/facebook/react/blob/d4bc16a7d69eb2ea38a88c8ac0b461d5f72cdcab/packages/react-dom/src/client/ReactDOMRoot.js#L83
    const defaultOnRecoverableError = typeof reportError === 'function' ? // emulating an uncaught JavaScript error.
    reportError : (error)=>{
        window.console.error(error);
    };
    // Skip certain custom errors which are not expected to be reported on client
    if (err.digest === _noSsrError.NEXT_DYNAMIC_NO_SSR_CODE) return;
    defaultOnRecoverableError(err);
}
const nextServerDataLoadingGlobal = self.__next_f = self.__next_f || [];
nextServerDataLoadingGlobal.forEach(nextServerDataCallback);
nextServerDataLoadingGlobal.push = nextServerDataCallback;
function createResponseCache() {
    return new Map();
}
const rscCache = createResponseCache();
function useInitialServerResponse(cacheKey) {
    const response = rscCache.get(cacheKey);
    if (response) return response;
    const readable = new ReadableStream({
        start (controller) {
            nextServerDataRegisterWriter(controller);
        }
    });
    const newResponse = (0, _client1).createFromReadableStream(readable);
    rscCache.set(cacheKey, newResponse);
    return newResponse;
}
function ServerRoot({ cacheKey  }) {
    _react.default.useEffect(()=>{
        rscCache.delete(cacheKey);
    });
    const response = useInitialServerResponse(cacheKey);
    const root = (0, _react).use(response);
    return root;
}
const StrictModeIfEnabled = process.env.__NEXT_STRICT_MODE_APP ? _react.default.StrictMode : _react.default.Fragment;
function Root({ children  }) {
    _react.default.useEffect(()=>{
        if (process.env.__NEXT_ANALYTICS_ID) {
            require('./performance-relayer-app')();
        }
    }, []);
    if (process.env.__NEXT_TEST_MODE) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        _react.default.useEffect(()=>{
            window.__NEXT_HYDRATED = true;
            if (window.__NEXT_HYDRATED_CB) {
                window.__NEXT_HYDRATED_CB();
            }
        }, []);
    }
    return children;
}
function RSCComponent(props) {
    const cacheKey = getCacheKey();
    return /*#__PURE__*/ _react.default.createElement(ServerRoot, Object.assign({}, props, {
        cacheKey: cacheKey
    }));
}
function hydrate() {
    if (process.env.NODE_ENV !== 'production') {
        const rootLayoutMissingTagsError = self.__next_root_layout_missing_tags_error;
        const HotReload = require('./components/react-dev-overlay/hot-reloader-client').default;
        // Don't try to hydrate if root layout is missing required tags, render error instead
        if (rootLayoutMissingTagsError) {
            const reactRootElement = document.createElement('div');
            document.body.appendChild(reactRootElement);
            const reactRoot = _client.default.createRoot(reactRootElement, {
                onRecoverableError
            });
            reactRoot.render(/*#__PURE__*/ _react.default.createElement(_appRouterContext.GlobalLayoutRouterContext.Provider, {
                value: {
                    tree: rootLayoutMissingTagsError.tree,
                    changeByServerResponse: ()=>{},
                    focusAndScrollRef: {
                        apply: false
                    }
                }
            }, /*#__PURE__*/ _react.default.createElement(HotReload, {
                assetPrefix: rootLayoutMissingTagsError.assetPrefix
            })));
            return;
        }
    }
    const reactEl = /*#__PURE__*/ _react.default.createElement(StrictModeIfEnabled, null, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
        value: {
            appDir: true
        }
    }, /*#__PURE__*/ _react.default.createElement(Root, null, /*#__PURE__*/ _react.default.createElement(RSCComponent, null))));
    const options = {
        onRecoverableError
    };
    const isError = document.documentElement.id === '__next_error__';
    const reactRoot = isError ? _client.default.createRoot(appElement, options) : _react.default.startTransition(()=>_client.default.hydrateRoot(appElement, reactEl, options));
    if (isError) {
        reactRoot.render(reactEl);
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-index.js.map