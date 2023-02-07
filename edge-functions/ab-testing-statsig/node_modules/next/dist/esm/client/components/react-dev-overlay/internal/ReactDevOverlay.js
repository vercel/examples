import * as React from 'react';
import { ACTION_UNHANDLED_ERROR } from './error-overlay-reducer';
import { ShadowPortal } from './components/ShadowPortal';
import { BuildError } from './container/BuildError';
import { Errors } from './container/Errors';
import { Base } from './styles/Base';
import { ComponentStyles } from './styles/ComponentStyles';
import { CssReset } from './styles/CssReset';
import { parseStack } from './helpers/parseStack';
import { RootLayoutError } from './container/RootLayoutError';
class ReactDevOverlay extends React.PureComponent {
    static getDerivedStateFromError(error) {
        const e = error;
        const event = {
            type: ACTION_UNHANDLED_ERROR,
            reason: error,
            frames: parseStack(e.stack)
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
        return /*#__PURE__*/ React.createElement(React.Fragment, null, reactError ? /*#__PURE__*/ React.createElement("html", null, /*#__PURE__*/ React.createElement("head", null), /*#__PURE__*/ React.createElement("body", null)) : children, isMounted ? /*#__PURE__*/ React.createElement(ShadowPortal, null, /*#__PURE__*/ React.createElement(CssReset, null), /*#__PURE__*/ React.createElement(Base, null), /*#__PURE__*/ React.createElement(ComponentStyles, null), rootLayoutMissingTagsError ? /*#__PURE__*/ React.createElement(RootLayoutError, {
            missingTags: rootLayoutMissingTagsError.missingTags
        }) : hasBuildError ? /*#__PURE__*/ React.createElement(BuildError, {
            message: state.buildError
        }) : reactError ? /*#__PURE__*/ React.createElement(Errors, {
            initialDisplayState: "fullscreen",
            errors: [
                reactError
            ]
        }) : hasRuntimeErrors ? /*#__PURE__*/ React.createElement(Errors, {
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
export default ReactDevOverlay;

//# sourceMappingURL=ReactDevOverlay.js.map