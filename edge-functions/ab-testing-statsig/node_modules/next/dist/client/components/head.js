"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultHead = DefaultHead;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
function DefaultHead() {
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("meta", {
        charSet: "utf-8"
    }), /*#__PURE__*/ _react.default.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
    }));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=head.js.map