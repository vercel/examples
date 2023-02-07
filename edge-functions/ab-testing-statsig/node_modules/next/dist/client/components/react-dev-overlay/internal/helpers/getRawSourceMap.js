"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRawSourceMap = getRawSourceMap;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _dataUriToBuffer = _interop_require_default(require("next/dist/compiled/data-uri-to-buffer"));
var _getSourceMapUrl = require("./getSourceMapUrl");
function getRawSourceMap(fileContents) {
    const sourceUrl = (0, _getSourceMapUrl).getSourceMapUrl(fileContents);
    if (!(sourceUrl == null ? void 0 : sourceUrl.startsWith('data:'))) {
        return null;
    }
    let buffer;
    try {
        // @ts-expect-error TODO-APP: fix type.
        buffer = (0, _dataUriToBuffer).default(sourceUrl);
    } catch (err) {
        console.error('Failed to parse source map URL:', err);
        return null;
    }
    if (buffer.type !== 'application/json') {
        console.error(`Unknown source map type: ${buffer.typeFull}.`);
        return null;
    }
    try {
        return JSON.parse(buffer.toString());
    } catch (e) {
        console.error('Failed to parse source map.');
        return null;
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=getRawSourceMap.js.map