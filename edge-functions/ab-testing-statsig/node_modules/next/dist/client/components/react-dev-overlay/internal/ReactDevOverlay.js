"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
var _errorOverlayReducer = require("./error-overlay-reducer");
var _shadowPortal = require("./components/ShadowPortal");
var _buildError = require("./container/BuildError");
var _errors = require("./container/Errors");
var _base = require("./styles/Base");
var _componentStyles = require("./styles/ComponentStyles");
var _cssReset = require("./styles/CssReset");
var _parseStack = require("./helpers/parseStack");
var _rootLayoutError = require("./container/RootLayoutError");
class ReactDevOverlay extends React.PureComponent {
    static getDerivedStateFromError(error) {
        const e = error;
        const event = {
            type: _errorOverlayReducer.ACTION_UNHANDLED_ERROR,
            reason: error,
            frames: (0, _parseStack).parseStack(e.stack)
        };
        const errorEvent = {
            id: 0,
            event
        };
        return {
            reactError: errorEvent
        };
    }
    componentDidCatch(componentErr) {
        this.props.onReactError(componentErr);
    }
    render() {
        const { state , children  } = this.props;
        const { reactError  } = this.state;
        const hasBuildError = state.buildError != null;
        const hasRuntimeErrors = Boolean(state.errors.length);
        const rootLayoutMissingTagsError = state.rootLayoutMissingTagsError;
        const isMounted = hasBuildError || hasRuntimeErrors || reactError || rootLayoutMissingTagsError;
        return /*#__PURE__*/ React.createElement(React.Fragment, null, reactError ? /*#__PURE__*/ React.createElement("html", null, /*#__PURE__*/ React.createElement("head", null), /*#__PURE__*/ React.createElement("body", null)) : children, isMounted ? /*#__PURE__*/ React.createElement(_shadowPortal.ShadowPortal, null, /*#__PURE__*/ React.createElement(_cssReset.CssReset, null), /*#__PURE__*/ React.createElement(_base.Base, null), /*#__PURE__*/ React.createElement(_componentStyles.ComponentStyles, null), rootLayoutMissingTagsError ? /*#__PURE__*/ React.createElement(_rootLayoutError.RootLayoutError, {
            missingTags: rootLayoutMissingTagsError.missingTags
        }) : hasBuildError ? /*#__PURE__*/ React.createElement(_buildError.BuildError, {
            message: state.buildError
        }) : reactError ? /*#__PURE__*/ React.createElement(_errors.Errors, {
            initialDisplayState: "fullscreen",
            errors: [
                reactError
            ]
        }) : hasRuntimeErrors ? /*#__PURE__*/ React.createElement(_errors.Errors, {
            initialDisplayState: "minimized",
            errors: state.errors
        }) : undefined) : undefined);
    }
    constructor(...args){
        super(...args);
        this.state = {
            reactError: null
        };
    }
}
var _default = ReactDevOverlay;
exports.default = _default;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=ReactDevOverlay.js.map