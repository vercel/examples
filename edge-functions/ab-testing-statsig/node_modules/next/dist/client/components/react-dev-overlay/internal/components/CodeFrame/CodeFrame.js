"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CodeFrame = void 0;
var _extends = require("@swc/helpers/lib/_extends.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _anser = _interop_require_default(require("next/dist/compiled/anser"));
var React = _interop_require_wildcard(require("react"));
var _stripAnsi = _interop_require_default(require("next/dist/compiled/strip-ansi"));
var _stackFrame = require("../../helpers/stack-frame");
const CodeFrame = function CodeFrame({ stackFrame , codeFrame ,  }) {
    // Strip leading spaces out of the code frame:
    const formattedFrame = React.useMemo(()=>{
        const lines = codeFrame.split(/\r?\n/g);
        const prefixLength = lines.map((line)=>/^>? +\d+ +\| [ ]+/.exec((0, _stripAnsi).default(line)) === null ? null : /^>? +\d+ +\| ( *)/.exec((0, _stripAnsi).default(line))).filter(Boolean).map((v)=>v.pop()).reduce((c, n)=>isNaN(c) ? n.length : Math.min(c, n.length), NaN);
        if (prefixLength > 1) {
            const p = ' '.repeat(prefixLength);
            return lines.map((line, a)=>~(a = line.indexOf('|')) ? line.substring(0, a) + line.substring(a).replace(p, '') : line).join('\n');
        }
        return lines.join('\n');
    }, [
        codeFrame
    ]);
    const decoded = React.useMemo(()=>{
        return _anser.default.ansiToJson(formattedFrame, {
            json: true,
            use_classes: true,
            remove_empty: true
        });
    }, [
        formattedFrame
    ]);
    const open = React.useCallback(()=>{
        const params = new URLSearchParams();
        for(const key in stackFrame){
            var _key;
            params.append(key, ((_key = stackFrame[key]) != null ? _key : '').toString());
        }
        self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/__nextjs_launch-editor?${params.toString()}`).then(()=>{}, ()=>{
            console.error('There was an issue opening this code in your editor.');
        });
    }, [
        stackFrame
    ]);
    // TODO: make the caret absolute
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-codeframe": true
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        role: "link",
        onClick: open,
        tabIndex: 1,
        title: "Click to open in your editor"
    }, /*#__PURE__*/ React.createElement("span", null, (0, _stackFrame).getFrameSource(stackFrame), " @ ", stackFrame.methodName), /*#__PURE__*/ React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/ React.createElement("polyline", {
        points: "15 3 21 3 21 9"
    }), /*#__PURE__*/ React.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
    })))), /*#__PURE__*/ React.createElement("pre", null, decoded.map((entry, index)=>/*#__PURE__*/ React.createElement("span", {
            key: `frame-${index}`,
            style: _extends({
                color: entry.fg ? `var(--color-${entry.fg})` : undefined
            }, entry.decoration === 'bold' ? {
                fontWeight: 800
            } : entry.decoration === 'italic' ? {
                fontStyle: 'italic'
            } : undefined)
        }, entry.content))));
};
exports.CodeFrame = CodeFrame;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=CodeFrame.js.map