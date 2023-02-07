"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bailoutToClientRendering = bailoutToClientRendering;
var _dynamicNoSsr = require("../../shared/lib/dynamic-no-ssr");
var _staticGenerationAsyncStorage = require("./static-generation-async-storage");
function bailoutToClientRendering() {
    const staticGenerationStore = _staticGenerationAsyncStorage.staticGenerationAsyncStorage && 'getStore' in _staticGenerationAsyncStorage.staticGenerationAsyncStorage ? _staticGenerationAsyncStorage.staticGenerationAsyncStorage == null ? void 0 : _staticGenerationAsyncStorage.staticGenerationAsyncStorage.getStore() : _staticGenerationAsyncStorage.staticGenerationAsyncStorage;
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        (0, _dynamicNoSsr).suspense();
    }
    return false;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=bailout-to-client-rendering.js.map