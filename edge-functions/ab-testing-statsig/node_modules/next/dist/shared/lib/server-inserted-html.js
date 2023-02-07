"use client";
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useServerInsertedHTML = useServerInsertedHTML;
exports.ServerInsertedHTMLContext = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _react = _interop_require_wildcard(require("react"));

const ServerInsertedHTMLContext = /*#__PURE__*/ _react.default.createContext(null);
exports.ServerInsertedHTMLContext = ServerInsertedHTMLContext;
function useServerInsertedHTML(callback) {
    const addInsertedServerHTMLCallback = (0, _react).useContext(ServerInsertedHTMLContext);
    // Should have no effects on client where there's no flush effects provider
    if (addInsertedServerHTMLCallback) {
        addInsertedServerHTMLCallback(callback);
    }
}

//# sourceMappingURL=server-inserted-html.js.map