"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useErrorHandler = useErrorHandler;
exports.RuntimeErrorHandler = void 0;
var _react = require("react");
const RuntimeErrorHandler = {
    hadRuntimeError: false
};
exports.RuntimeErrorHandler = RuntimeErrorHandler;
function isNextRouterError(error) {
    return error && error.digest && (error.digest.startsWith('NEXT_REDIRECT') || error.digest === 'NEXT_NOT_FOUND');
}
function isHydrationError(error) {
    return error.message.match(/(hydration|content does not match|did not match)/i) != null;
}
if (typeof window !== 'undefined') {
    try {
        // Increase the number of stack frames on the client
        Error.stackTraceLimit = 50;
    } catch (e) {}
}
const errorQueue = [];
const rejectionQueue = [];
const errorHandlers = [];
const rejectionHandlers = [];
if (typeof window !== 'undefined') {
    // These event handlers must be added outside of the hook because there is no
    // guarantee that the hook will be alive in a mounted component in time to
    // when the errors occur.
    window.addEventListener('error', (ev)=>{
        if (isNextRouterError(ev.error)) {
            ev.preventDefault();
            return;
        }
        const error = ev == null ? void 0 : ev.error;
        if (!error || !(error instanceof Error) || typeof error.stack !== 'string') {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        if (isHydrationError(error)) {
            error.message += `\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error`;
        }
        const e = error;
        errorQueue.push(e);
        for (const handler of errorHandlers){
            handler(e);
        }
    });
    window.addEventListener('unhandledrejection', (ev)=>{
        const reason = ev == null ? void 0 : ev.reason;
        if (!reason || !(reason instanceof Error) || typeof reason.stack !== 'string') {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        const e = reason;
        rejectionQueue.push(e);
        for (const handler of rejectionHandlers){
            handler(e);
        }
    });
}
function useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection) {
    (0, _react).useEffect(()=>{
        // Handle queued errors.
        errorQueue.forEach(handleOnUnhandledError);
        rejectionQueue.forEach(handleOnUnhandledRejection);
        // Listen to new errors.
        errorHandlers.push(handleOnUnhandledError);
        rejectionHandlers.push(handleOnUnhandledRejection);
        return ()=>{
            // Remove listeners.
            errorHandlers.splice(errorHandlers.indexOf(handleOnUnhandledError), 1);
            rejectionHandlers.splice(rejectionHandlers.indexOf(handleOnUnhandledRejection), 1);
        };
    }, [
        handleOnUnhandledError,
        handleOnUnhandledRejection
    ]);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=use-error-handler.js.map