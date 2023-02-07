"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DialogHeader = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
const DialogHeader = function DialogHeader({ children , className ,  }) {
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-header": true,
        className: className
    }, children);
};
exports.DialogHeader = DialogHeader;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=DialogHeader.js.map