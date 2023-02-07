"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requestAsyncStorage = void 0;
let requestAsyncStorage = {};
exports.requestAsyncStorage = requestAsyncStorage;
// @ts-expect-error we provide this on globalThis in
// the edge and node runtime
if (globalThis.AsyncLocalStorage) {
    exports.requestAsyncStorage = requestAsyncStorage = new globalThis.AsyncLocalStorage();
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=request-async-storage.js.map