"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.headers = headers;
exports.previewData = previewData;
exports.cookies = cookies;
var _cookies = require("../../server/web/spec-extension/cookies");
var _requestAsyncStorage = require("./request-async-storage");
var _staticGenerationBailout = require("./static-generation-bailout");
function headers() {
    if ((0, _staticGenerationBailout).staticGenerationBailout('headers')) {
        return new Headers({});
    }
    const requestStore = _requestAsyncStorage.requestAsyncStorage && 'getStore' in _requestAsyncStorage.requestAsyncStorage ? _requestAsyncStorage.requestAsyncStorage.getStore() : _requestAsyncStorage.requestAsyncStorage;
    return requestStore.headers;
}
function previewData() {
    const requestStore = _requestAsyncStorage.requestAsyncStorage && 'getStore' in _requestAsyncStorage.requestAsyncStorage ? _requestAsyncStorage.requestAsyncStorage.getStore() : _requestAsyncStorage.requestAsyncStorage;
    return requestStore.previewData;
}
function cookies() {
    if ((0, _staticGenerationBailout).staticGenerationBailout('cookies')) {
        return new _cookies.RequestCookies(new Headers({}));
    }
    const requestStore = _requestAsyncStorage.requestAsyncStorage && 'getStore' in _requestAsyncStorage.requestAsyncStorage ? _requestAsyncStorage.requestAsyncStorage.getStore() : _requestAsyncStorage.requestAsyncStorage;
    return requestStore.cookies;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=headers.js.map