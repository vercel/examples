"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HotReload;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _react = _interop_require_wildcard(require("react"));
var _stripAnsi = _interop_require_default(require("next/dist/compiled/strip-ansi"));
var _formatWebpackMessages = _interop_require_default(require("../../dev/error-overlay/format-webpack-messages"));
var _navigation = require("../navigation");
var _errorOverlayReducer = require("./internal/error-overlay-reducer");
var _parseStack = require("./internal/helpers/parseStack");
var _reactDevOverlay = _interop_require_default(require("./internal/ReactDevOverlay"));
var _useErrorHandler = require("./internal/helpers/use-error-handler");
var _useWebsocket = require("./internal/helpers/use-websocket");
function HotReload({ assetPrefix , children  }) {
    const [state, dispatch] = (0, _react).useReducer(_errorOverlayReducer.errorOverlayReducer, {
        nextId: 1,
        buildError: null,
        errors: [],
        refreshState: {
            type: 'idle'
        }
    });
    const dispatcher = (0, _react).useMemo(()=>{
        return {
            onBuildOk () {
                dispatch({
                    type: _errorOverlayReducer.ACTION_BUILD_OK
                });
            },
            onBuildError (message) {
                dispatch({
                    type: _errorOverlayReducer.ACTION_BUILD_ERROR,
                    message
                });
            },
            onBeforeRefresh () {
                dispatch({
                    type: _errorOverlayReducer.ACTION_BEFORE_REFRESH
                });
            },
            onRefresh () {
                dispatch({
                    type: _errorOverlayReducer.ACTION_REFRESH
                });
            }
        };
    }, [
        dispatch
    ]);
    const handleOnUnhandledError = (0, _react).useCallback((error)=>{
        dispatch({
            type: _errorOverlayReducer.ACTION_UNHANDLED_ERROR,
            reason: error,
            frames: (0, _parseStack).parseStack(error.stack)
        });
    }, []);
    const handleOnUnhandledRejection = (0, _react).useCallback((reason)=>{
        dispatch({
            type: _errorOverlayReducer.ACTION_UNHANDLED_REJECTION,
            reason: reason,
            frames: (0, _parseStack).parseStack(reason.stack)
        });
    }, []);
    const handleOnReactError = (0, _react).useCallback(()=>{
        _useErrorHandler.RuntimeErrorHandler.hadRuntimeError = true;
    }, []);
    (0, _useErrorHandler).useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection);
    const webSocketRef = (0, _useWebsocket).useWebsocket(assetPrefix);
    (0, _useWebsocket).useWebsocketPing(webSocketRef);
    const sendMessage = (0, _useWebsocket).useSendMessage(webSocketRef);
    const router = (0, _navigation).useRouter();
    (0, _react).useEffect(()=>{
        const handler = (event)=>{
            if (event.data.indexOf('action') === -1 && // TODO-APP: clean this up for consistency
            event.data.indexOf('pong') === -1) {
                return;
            }
            try {
                processMessage(event, sendMessage, router, dispatcher);
            } catch (ex) {
                console.warn('Invalid HMR message: ' + event.data + '\n', ex);
            }
        };
        const websocket = webSocketRef.current;
        if (websocket) {
            websocket.addEventListener('message', handler);
        }
        return ()=>websocket && websocket.removeEventListener('message', handler);
    }, [
        sendMessage,
        router,
        webSocketRef,
        dispatcher
    ]);
    return /*#__PURE__*/ _react.default.createElement(_reactDevOverlay.default, {
        onReactError: handleOnReactError,
        state: state
    }, children);
}
let mostRecentCompilationHash = null;
let __nextDevClientId = Math.round(Math.random() * 100 + Date.now());
// let startLatency = undefined
function onBeforeFastRefresh(dispatcher, hasUpdates) {
    if (hasUpdates) {
        dispatcher.onBeforeRefresh();
    }
}
function onFastRefresh(dispatcher, hasUpdates) {
    dispatcher.onBuildOk();
    if (hasUpdates) {
        dispatcher.onRefresh();
    }
}
// There is a newer version of the code available.
function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
}
// Is there a newer version of this code available?
function isUpdateAvailable() {
    /* globals __webpack_hash__ */ // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    // @ts-expect-error __webpack_hash__ exists
    return mostRecentCompilationHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    // @ts-expect-error module.hot exists
    return module.hot.status() === 'idle';
}
function afterApplyUpdates(fn) {
    if (canApplyUpdates()) {
        fn();
    } else {
        function handler(status) {
            if (status === 'idle') {
                // @ts-expect-error module.hot exists
                module.hot.removeStatusHandler(handler);
                fn();
            }
        }
        // @ts-expect-error module.hot exists
        module.hot.addStatusHandler(handler);
    }
}
function performFullReload(err, sendMessage) {
    const stackTrace = err && (err.stack && err.stack.split('\n').slice(0, 5).join('\n') || err.message || err + '');
    sendMessage(JSON.stringify({
        event: 'client-full-reload',
        stackTrace,
        hadRuntimeError: !!_useErrorHandler.RuntimeErrorHandler.hadRuntimeError
    }));
    window.location.reload();
}
// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onBeforeUpdate, onHotUpdateSuccess, sendMessage, dispatcher) {
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        dispatcher.onBuildOk();
        return;
    }
    function handleApplyUpdates(err, updatedModules) {
        if (err || _useErrorHandler.RuntimeErrorHandler.hadRuntimeError || !updatedModules) {
            if (err) {
                console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
            } else if (_useErrorHandler.RuntimeErrorHandler.hadRuntimeError) {
                console.warn('[Fast Refresh] performing full reload because your application had an unrecoverable error');
            }
            performFullReload(err, sendMessage);
            return;
        }
        const hasUpdates = Boolean(updatedModules.length);
        if (typeof onHotUpdateSuccess === 'function') {
            // Maybe we want to do something.
            onHotUpdateSuccess(hasUpdates);
        }
        if (isUpdateAvailable()) {
            // While we were updating, there was a new update! Do it again.
            tryApplyUpdates(hasUpdates ? ()=>{} : onBeforeUpdate, hasUpdates ? ()=>dispatcher.onBuildOk() : onHotUpdateSuccess, sendMessage, dispatcher);
        } else {
            dispatcher.onBuildOk();
            if (process.env.__NEXT_TEST_MODE) {
                afterApplyUpdates(()=>{
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                });
            }
        }
    }
    // https://webpack.js.org/api/hot-module-replacement/#check
    // @ts-expect-error module.hot exists
    module.hot.check(/* autoApply */ false).then((updatedModules)=>{
        if (!updatedModules) {
            return null;
        }
        if (typeof onBeforeUpdate === 'function') {
            const hasUpdates = Boolean(updatedModules.length);
            onBeforeUpdate(hasUpdates);
        }
        // https://webpack.js.org/api/hot-module-replacement/#apply
        // @ts-expect-error module.hot exists
        return module.hot.apply();
    }).then((updatedModules)=>{
        handleApplyUpdates(null, updatedModules);
    }, (err)=>{
        handleApplyUpdates(err, null);
    });
}
function processMessage(e, sendMessage, router, dispatcher) {
    const obj = JSON.parse(e.data);
    switch(obj.action){
        case 'building':
            {
                console.log('[Fast Refresh] rebuilding');
                break;
            }
        case 'built':
        case 'sync':
            {
                if (obj.hash) {
                    handleAvailableHash(obj.hash);
                }
                const { errors , warnings  } = obj;
                const hasErrors = Boolean(errors && errors.length);
                // Compilation with errors (e.g. syntax error or missing modules).
                if (hasErrors) {
                    sendMessage(JSON.stringify({
                        event: 'client-error',
                        errorCount: errors.length,
                        clientId: __nextDevClientId
                    }));
                    // "Massage" webpack messages.
                    var formatted = (0, _formatWebpackMessages).default({
                        errors: errors,
                        warnings: []
                    });
                    // Only show the first error.
                    dispatcher.onBuildError(formatted.errors[0]);
                    // Also log them to the console.
                    for(let i = 0; i < formatted.errors.length; i++){
                        console.error((0, _stripAnsi).default(formatted.errors[i]));
                    }
                    // Do not attempt to reload now.
                    // We will reload on next success instead.
                    if (process.env.__NEXT_TEST_MODE) {
                        if (self.__NEXT_HMR_CB) {
                            self.__NEXT_HMR_CB(formatted.errors[0]);
                            self.__NEXT_HMR_CB = null;
                        }
                    }
                    return;
                }
                const hasWarnings = Boolean(warnings && warnings.length);
                if (hasWarnings) {
                    sendMessage(JSON.stringify({
                        event: 'client-warning',
                        warningCount: warnings.length,
                        clientId: __nextDevClientId
                    }));
                    // Compilation with warnings (e.g. ESLint).
                    const isHotUpdate = obj.action !== 'sync';
                    // Print warnings to the console.
                    const formattedMessages = (0, _formatWebpackMessages).default({
                        warnings: warnings,
                        errors: []
                    });
                    for(let i = 0; i < formattedMessages.warnings.length; i++){
                        if (i === 5) {
                            console.warn('There were more warnings in other files.\n' + 'You can find a complete log in the terminal.');
                            break;
                        }
                        console.warn((0, _stripAnsi).default(formattedMessages.warnings[i]));
                    }
                    // Attempt to apply hot updates or reload.
                    if (isHotUpdate) {
                        tryApplyUpdates(function onBeforeHotUpdate(hasUpdates) {
                            onBeforeFastRefresh(dispatcher, hasUpdates);
                        }, function onSuccessfulHotUpdate(hasUpdates) {
                            // Only dismiss it when we're sure it's a hot update.
                            // Otherwise it would flicker right before the reload.
                            onFastRefresh(dispatcher, hasUpdates);
                        }, sendMessage, dispatcher);
                    }
                    return;
                }
                sendMessage(JSON.stringify({
                    event: 'client-success',
                    clientId: __nextDevClientId
                }));
                const isHotUpdate = obj.action !== 'sync' || (!window.__NEXT_DATA__ || window.__NEXT_DATA__.page !== '/_error') && isUpdateAvailable();
                // Attempt to apply hot updates or reload.
                if (isHotUpdate) {
                    tryApplyUpdates(function onBeforeHotUpdate(hasUpdates) {
                        onBeforeFastRefresh(dispatcher, hasUpdates);
                    }, function onSuccessfulHotUpdate(hasUpdates) {
                        // Only dismiss it when we're sure it's a hot update.
                        // Otherwise it would flicker right before the reload.
                        onFastRefresh(dispatcher, hasUpdates);
                    }, sendMessage, dispatcher);
                }
                return;
            }
        // TODO-APP: make server component change more granular
        case 'serverComponentChanges':
            {
                sendMessage(JSON.stringify({
                    event: 'server-component-reload-page',
                    clientId: __nextDevClientId
                }));
                if (_useErrorHandler.RuntimeErrorHandler.hadRuntimeError) {
                    return window.location.reload();
                }
                (0, _react).startTransition(()=>{
                    router.refresh();
                    dispatcher.onRefresh();
                });
                if (process.env.__NEXT_TEST_MODE) {
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                }
                return;
            }
        case 'reloadPage':
            {
                sendMessage(JSON.stringify({
                    event: 'client-reload-page',
                    clientId: __nextDevClientId
                }));
                return window.location.reload();
            }
        case 'removedPage':
            {
                // TODO-APP: potentially only refresh if the currently viewed page was removed.
                router.refresh();
                return;
            }
        case 'addedPage':
            {
                // TODO-APP: potentially only refresh if the currently viewed page was added.
                router.refresh();
                return;
            }
        case 'pong':
            {
                const { invalid  } = obj;
                if (invalid) {
                    // Payload can be invalid even if the page does exist.
                    // So, we check if it can be created.
                    router.refresh();
                }
                return;
            }
        default:
            {
                throw new Error('Unexpected action ' + obj.action);
            }
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=hot-reloader-client.js.map