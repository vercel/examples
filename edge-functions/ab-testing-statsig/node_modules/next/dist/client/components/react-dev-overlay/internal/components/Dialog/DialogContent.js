"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DialogContent = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
const DialogContent = function DialogContent({ children , className ,  }) {
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-content": true,
        className: className
    }, children);
};
exports.DialogContent = DialogContent;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=DialogContent.js.map