import * as React from 'react';
import { Dialog, DialogBody, DialogContent, DialogHeader } from '../components/Dialog';
import { Overlay } from '../components/Overlay';
import { Terminal } from '../components/Terminal';
import { noop as css } from '../helpers/noop-template';
export const BuildError = function BuildError({ message ,  }) {
    const noop = React.useCallback(()=>{}, []);
    return /*#__PURE__*/ React.createElement(Overlay, {
        fixed: true
    }, /*#__PURE__*/ React.createElement(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_build_error_label",
        "aria-describedby": "nextjs__container_build_error_desc",
        onClose: noop
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, {
        className: "nextjs-container-build-error-header"
    }, /*#__PURE__*/ React.createElement("h4", {
        id: "nextjs__container_build_error_label"
    }, "Failed to compile")), /*#__PURE__*/ React.createElement(DialogBody, {
        className: "nextjs-container-build-error-body"
    }, /*#__PURE__*/ React.createElement(Terminal, {
        content: message
    }), /*#__PURE__*/ React.createElement("footer", null, /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_build_error_desc"
    }, /*#__PURE__*/ React.createElement("small", null, "This error occurred during the build process and can only be dismissed by fixing the error.")))))));
};
export const styles = css`
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

//# sourceMappingURL=BuildError.js.map