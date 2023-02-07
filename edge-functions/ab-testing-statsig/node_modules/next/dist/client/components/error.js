"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotFound = NotFound;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
const styles = {
    error: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        display: 'inline-block',
        textAlign: 'left',
        lineHeight: '49px',
        height: '49px',
        verticalAlign: 'middle'
    },
    h1: {
        display: 'inline-block',
        margin: 0,
        marginRight: '20px',
        padding: '0 23px 0 0',
        fontSize: '24px',
        fontWeight: 500,
        verticalAlign: 'top',
        lineHeight: '49px'
    },
    h2: {
        fontSize: '14px',
        fontWeight: 'normal',
        lineHeight: '49px',
        margin: 0,
        padding: 0
    }
};
function NotFound() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        style: styles.error
    }, /*#__PURE__*/ _react.default.createElement("head", null, /*#__PURE__*/ _react.default.createElement("title", null, "404: This page could not be found.")), /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("style", {
        dangerouslySetInnerHTML: {
            __html: `
            body { margin: 0; color: #000; background: #fff; }
            .next-error-h1 {
              border-right: 1px solid rgba(0, 0, 0, .3);
            }

            @media (prefers-color-scheme: dark) {
              body { color: #fff; background: #000; }
              .next-error-h1 {
                border-right: 1px solid rgba(255, 255, 255, .3);
              }
            }
          `
        }
    }), /*#__PURE__*/ _react.default.createElement("h1", {
        className: "next-error-h1",
        style: styles.h1
    }, "404"), /*#__PURE__*/ _react.default.createElement("div", {
        style: styles.desc
    }, /*#__PURE__*/ _react.default.createElement("h2", {
        style: styles.h2
    }, "This page could not be found."))));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=error.js.map