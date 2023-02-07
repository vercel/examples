"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.styles = exports.RootLayoutError = void 0;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _dialog = require("../components/Dialog");
var _overlay = require("../components/Overlay");
var _terminal = require("../components/Terminal");
var _noopTemplate = require("../helpers/noop-template");
const RootLayoutError = function BuildError({ missingTags  }) {
    const message = 'Please make sure to include the following tags in your root layout: <html>, <body>.\n\n' + `Missing required root layout tag${missingTags.length === 1 ? '' : 's'}: ` + missingTags.join(', ');
    const noop = _react.default.useCallback(()=>{}, []);
    return /*#__PURE__*/ _react.default.createElement(_overlay.Overlay, {
        fixed: true
    }, /*#__PURE__*/ _react.default.createElement(_dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_root_layout_error_label",
        "aria-describedby": "nextjs__container_root_layout_error_desc",
        onClose: noop
    }, /*#__PURE__*/ _react.default.createElement(_dialog.DialogContent, null, /*#__PURE__*/ _react.default.createElement(_dialog.DialogHeader, {
        className: "nextjs-container-root-layout-error-header"
    }, /*#__PURE__*/ _react.default.createElement("h4", {
        id: "nextjs__container_root_layout_error_label"
    }, "Missing required tags")), /*#__PURE__*/ _react.default.createElement(_dialog.DialogBody, {
        className: "nextjs-container-root-layout-error-body"
    }, /*#__PURE__*/ _react.default.createElement(_terminal.Terminal, {
        content: message
    }), /*#__PURE__*/ _react.default.createElement("footer", null, /*#__PURE__*/ _react.default.createElement("p", {
        id: "nextjs__container_root_layout_error_desc"
    }, /*#__PURE__*/ _react.default.createElement("small", null, "This error and can only be dismissed by providing all required tags.")))))));
};
exports.RootLayoutError = RootLayoutError;
const styles = _noopTemplate.noop`
  .nextjs-container-root-layout-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-root-layout-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-root-layout-error-body footer p {
    margin: 0;
  }

  .nextjs-container-root-layout-error-body small {
    color: #757575;
  }
`;
exports.styles = styles;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=RootLayoutError.js.map