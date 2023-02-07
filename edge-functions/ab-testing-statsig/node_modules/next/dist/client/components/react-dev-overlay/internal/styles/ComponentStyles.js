"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ComponentStyles = ComponentStyles;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
var _styles = require("../components/CodeFrame/styles");
var _dialog = require("../components/Dialog");
var _styles1 = require("../components/LeftRightDialogHeader/styles");
var _styles2 = require("../components/Overlay/styles");
var _styles3 = require("../components/Terminal/styles");
var _toast = require("../components/Toast");
var _buildError = require("../container/BuildError");
var _rootLayoutError = require("../container/RootLayoutError");
var _errors = require("../container/Errors");
var _runtimeError = require("../container/RuntimeError");
var _noopTemplate = require("../helpers/noop-template");
function ComponentStyles() {
    return /*#__PURE__*/ React.createElement("style", null, _noopTemplate.noop`
        ${_styles2.styles}
        ${_toast.styles}
        ${_dialog.styles}
        ${_styles1.styles}
        ${_styles.styles}
        ${_styles3.styles}
        
        ${_buildError.styles}
        ${_rootLayoutError.styles}
        ${_errors.styles}
        ${_runtimeError.styles}
      `);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=ComponentStyles.js.map