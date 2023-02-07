"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Overlay = void 0;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _maintainTabFocus = _interop_require_default(require("./maintain--tab-focus"));
var React = _interop_require_wildcard(require("react"));
var _bodyLocker = require("./body-locker");
const Overlay = function Overlay({ className , children , fixed ,  }) {
    React.useEffect(()=>{
        (0, _bodyLocker).lock();
        return ()=>{
            (0, _bodyLocker).unlock();
        };
    }, []);
    const [overlay, setOverlay] = React.useState(null);
    const onOverlay = React.useCallback((el)=>{
        setOverlay(el);
    }, []);
    React.useEffect(()=>{
        if (overlay == null) {
            return;
        }
        const handle2 = (0, _maintainTabFocus).default({
            context: overlay
        });
        return ()=>{
            handle2.disengage();
        };
    }, [
        overlay
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-overlay": true,
        className: className,
        ref: onOverlay
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-backdrop": true,
        "data-nextjs-dialog-backdrop-fixed": fixed ? true : undefined
    }), children);
};
exports.Overlay = Overlay;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Overlay.js.map