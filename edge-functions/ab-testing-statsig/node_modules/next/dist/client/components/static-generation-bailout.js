"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.staticGenerationBailout = staticGenerationBailout;
var _hooksServerContext = require("./hooks-server-context");
var _staticGenerationAsyncStorage = require("./static-generation-async-storage");
function staticGenerationBailout(reason) {
    const staticGenerationStore = _staticGenerationAsyncStorage.staticGenerationAsyncStorage && 'getStore' in _staticGenerationAsyncStorage.staticGenerationAsyncStorage ? _staticGenerationAsyncStorage.staticGenerationAsyncStorage == null ? void 0 : _staticGenerationAsyncStorage.staticGenerationAsyncStorage.getStore() : _staticGenerationAsyncStorage.staticGenerationAsyncStorage;
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        if (staticGenerationStore) {
            staticGenerationStore.fetchRevalidate = 0;
        }
        throw new _hooksServerContext.DynamicServerError(reason);
    }
    return false;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=static-generation-bailout.js.map