"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.styles = exports.BuildError = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
var _dialog = require("../components/Dialog");
var _overlay = require("../components/Overlay");
var _terminal = require("../components/Terminal");
var _noopTemplate = require("../helpers/noop-template");
const BuildError = function BuildError({ message ,  }) {
    const noop = React.useCallback(()=>{}, []);
    return /*#__PURE__*/ React.createElement(_overlay.Overlay, {
        fixed: true
    }, /*#__PURE__*/ React.createElement(_dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_build_error_label",
        "aria-describedby": "nextjs__container_build_error_desc",
        onClose: noop
    }, /*#__PURE__*/ React.createElement(_dialog.DialogContent, null, /*#__PURE__*/ React.createElement(_dialog.DialogHeader, {
        className: "nextjs-container-build-error-header"
    }, /*#__PURE__*/ React.createElement("h4", {
        id: "nextjs__container_build_error_label"
    }, "Failed to compile")), /*#__PURE__*/ React.createElement(_dialog.DialogBody, {
        className: "nextjs-container-build-error-body"
    }, /*#__PURE__*/ React.createElement(_terminal.Terminal, {
        content: message
    }), /*#__PURE__*/ React.createElement("footer", null, /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_build_error_desc"
    }, /*#__PURE__*/ React.createElement("small", null, "This error occurred during the build process and can only be dismissed by fixing the error.")))))));
};
exports.BuildError = BuildError;
const styles = _noopTemplate.noop`
  .nextjs-container-build-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-build-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-build-error-body footer p {
    margin: 0;
  }

  .nextjs-container-build-error-body small {
    color: #757575;
  }
`;
exports.styles = styles;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=BuildError.js.map