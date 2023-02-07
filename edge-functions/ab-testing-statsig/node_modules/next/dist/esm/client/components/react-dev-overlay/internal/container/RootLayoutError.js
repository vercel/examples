import React from 'react';
import { Dialog, DialogBody, DialogContent, DialogHeader } from '../components/Dialog';
import { Overlay } from '../components/Overlay';
import { Terminal } from '../components/Terminal';
import { noop as css } from '../helpers/noop-template';
export const RootLayoutError = function BuildError({ missingTags  }) {
    const message = 'Please make sure to include the following tags in your root layout: <html>, <body>.\n\n' + `Missing required root layout tag${missingTags.length === 1 ? '' : 's'}: ` + missingTags.join(', ');
    const noop = React.useCallback(()=>{}, []);
    return /*#__PURE__*/ React.createElement(Overlay, {
        fixed: true
    }, /*#__PURE__*/ React.createElement(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_root_layout_error_label",
        "aria-describedby": "nextjs__container_root_layout_error_desc",
        onClose: noop
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, {
        className: "nextjs-container-root-layout-error-header"
    }, /*#__PURE__*/ React.createElement("h4", {
        id: "nextjs__container_root_layout_error_label"
    }, "Missing required tags")), /*#__PURE__*/ React.createElement(DialogBody, {
        className: "nextjs-container-root-layout-error-body"
    }, /*#__PURE__*/ React.createElement(Terminal, {
        content: message
    }), /*#__PURE__*/ React.createElement("footer", null, /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_root_layout_error_desc"
    }, /*#__PURE__*/ React.createElement("small", null, "This error and can only be dismissed by providing all required tags.")))))));
};
export const styles = css`
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

//# sourceMappingURL=RootLayoutError.js.map