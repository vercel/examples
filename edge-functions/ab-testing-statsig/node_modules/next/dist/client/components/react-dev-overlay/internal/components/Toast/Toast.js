"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Toast = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
const Toast = function Toast({ onClick , children , className ,  }) {
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-toast": true,
        onClick: onClick,
        className: className
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-toast-wrapper": true
    }, children));
};
exports.Toast = Toast;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Toast.js.map