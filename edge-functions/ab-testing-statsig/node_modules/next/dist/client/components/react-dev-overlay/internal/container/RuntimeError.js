"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.styles = exports.RuntimeError = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
var _codeFrame = require("../components/CodeFrame");
var _noopTemplate = require("../helpers/noop-template");
var _stackFrame = require("../helpers/stack-frame");
const CallStackFrame = function CallStackFrame({ frame  }) {
    var _originalStackFrame;
    // TODO: ability to expand resolved frames
    // TODO: render error or external indicator
    const f = (_originalStackFrame = frame.originalStackFrame) != null ? _originalStackFrame : frame.sourceStackFrame;
    const hasSource = Boolean(frame.originalCodeFrame);
    const open = React.useCallback(()=>{
        if (!hasSource) return;
        const params = new URLSearchParams();
        for(const key in f){
            var _key;
            params.append(key, ((_key = f[key]) != null ? _key : '').toString());
        }
        self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/__nextjs_launch-editor?${params.toString()}`).then(()=>{}, ()=>{
            console.error('There was an issue opening this code in your editor.');
        });
    }, [
        hasSource,
        f
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-call-stack-frame": true
    }, /*#__PURE__*/ React.createElement("h6", {
        "data-nextjs-frame-expanded": Boolean(frame.expanded)
    }, f.methodName), /*#__PURE__*/ React.createElement("div", {
        "data-has-source": hasSource ? 'true' : undefined,
        tabIndex: hasSource ? 10 : undefined,
        role: hasSource ? 'link' : undefined,
        onClick: open,
        title: hasSource ? 'Click to open in your editor' : undefined
    }, /*#__PURE__*/ React.createElement("span", null, (0, _stackFrame).getFrameSource(f)), /*#__PURE__*/ React.createElement("svg", {
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
    }))));
};
const RuntimeError = function RuntimeError({ error ,  }) {
    const firstFirstPartyFrameIndex = React.useMemo(()=>{
        return error.frames.findIndex((entry)=>entry.expanded && Boolean(entry.originalCodeFrame) && Boolean(entry.originalStackFrame));
    }, [
        error.frames
    ]);
    const firstFrame = React.useMemo(()=>{
        var _firstFirstPartyFrameIndex;
        return (_firstFirstPartyFrameIndex = error.frames[firstFirstPartyFrameIndex]) != null ? _firstFirstPartyFrameIndex : null;
    }, [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const allLeadingFrames = React.useMemo(()=>firstFirstPartyFrameIndex < 0 ? [] : error.frames.slice(0, firstFirstPartyFrameIndex), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const [all, setAll] = React.useState(firstFrame == null);
    const toggleAll = React.useCallback(()=>{
        setAll((v)=>!v);
    }, []);
    const leadingFrames = React.useMemo(()=>allLeadingFrames.filter((f)=>f.expanded || all), [
        all,
        allLeadingFrames
    ]);
    const allCallStackFrames = React.useMemo(()=>error.frames.slice(firstFirstPartyFrameIndex + 1), [
        error.frames,
        firstFirstPartyFrameIndex
    ]);
    const visibleCallStackFrames = React.useMemo(()=>allCallStackFrames.filter((f)=>f.expanded || all), [
        all,
        allCallStackFrames
    ]);
    const canShowMore = React.useMemo(()=>{
        return allCallStackFrames.length !== visibleCallStackFrames.length || all && firstFrame != null;
    }, [
        all,
        allCallStackFrames.length,
        firstFrame,
        visibleCallStackFrames.length, 
    ]);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, firstFrame ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h5", null, "Source"), leadingFrames.map((frame, index)=>/*#__PURE__*/ React.createElement(CallStackFrame, {
            key: `leading-frame-${index}-${all}`,
            frame: frame
        })), /*#__PURE__*/ React.createElement(_codeFrame.CodeFrame, {
        stackFrame: firstFrame.originalStackFrame,
        codeFrame: firstFrame.originalCodeFrame
    })) : undefined, visibleCallStackFrames.length ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h5", null, "Call Stack"), visibleCallStackFrames.map((frame, index)=>/*#__PURE__*/ React.createElement(CallStackFrame, {
            key: `call-stack-${index}-${all}`,
            frame: frame
        }))) : undefined, canShowMore ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("button", {
        tabIndex: 10,
        "data-nextjs-data-runtime-error-collapsed-action": true,
        type: "button",
        onClick: toggleAll
    }, all ? 'Hide' : 'Show', " collapsed frames")) : undefined);
};
const styles = _noopTemplate.noop`
  button[data-nextjs-data-runtime-error-collapsed-action] {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--size-font-small);
    line-height: var(--size-font-bigger);
    color: var(--color-accents-3);
  }

  [data-nextjs-call-stack-frame]:not(:last-child) {
    margin-bottom: var(--size-gap-double);
  }

  [data-nextjs-call-stack-frame] > h6 {
    margin-top: 0;
    margin-bottom: var(--size-gap);
    font-family: var(--font-stack-monospace);
    color: #222;
  }
  [data-nextjs-call-stack-frame] > h6[data-nextjs-frame-expanded='false'] {
    color: #666;
  }
  [data-nextjs-call-stack-frame] > div {
    display: flex;
    align-items: center;
    padding-left: calc(var(--size-gap) + var(--size-gap-half));
    font-size: var(--size-font-small);
    color: #999;
  }
  [data-nextjs-call-stack-frame] > div > svg {
    width: auto;
    height: var(--size-font-small);
    margin-left: var(--size-gap);

    display: none;
  }

  [data-nextjs-call-stack-frame] > div[data-has-source] {
    cursor: pointer;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source]:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source] > svg {
    display: unset;
  }
`;
exports.styles = styles;
exports.RuntimeError = RuntimeError;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=RuntimeError.js.map