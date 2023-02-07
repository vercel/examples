"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Terminal = void 0;
var _extends = require("@swc/helpers/lib/_extends.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _anser = _interop_require_default(require("next/dist/compiled/anser"));
var React = _interop_require_wildcard(require("react"));
const Terminal = function Terminal({ content ,  }) {
    const decoded = React.useMemo(()=>{
        return _anser.default.ansiToJson(content, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        content
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-terminal": true
    }, /*#__PURE__*/ React.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ React.createElement("span", {
            key: `terminal-entry-${index}`,
            style: _extends({
                color: entry.fg ? `var(--color-${entry.fg})` : undefined
            }, entry.decoration === 'bold' ? {
                fontWeight: 800
            } : entry.decoration === 'italic' ? {
                fontStyle: 'italic'
            } : undefined)
        }, entry.content))));
};
exports.Terminal = Terminal;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Terminal.js.map