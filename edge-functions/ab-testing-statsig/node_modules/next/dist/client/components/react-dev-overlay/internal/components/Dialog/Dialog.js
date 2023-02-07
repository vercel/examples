"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dialog = void 0;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _object_without_properties_loose = require("@swc/helpers/lib/_object_without_properties_loose.js").default;
var React = _interop_require_wildcard(require("react"));
var _useOnClickOutside = require("../../hooks/use-on-click-outside");
const Dialog = function Dialog(_param) {
    var { children , type , onClose  } = _param, props = _object_without_properties_loose(_param, [
        "children",
        "type",
        "onClose"
    ]);
    const [dialog, setDialog] = React.useState(null);
    const onDialog = React.useCallback((node)=>{
        setDialog(node);
    }, []);
    (0, _useOnClickOutside).useOnClickOutside(dialog, onClose);
    // Make HTMLElements with `role=link` accessible to be triggered by the
    // keyboard, i.e. [Enter].
    React.useEffect(()=>{
        if (dialog == null) {
            return;
        }
        const root = dialog.getRootNode();
        // Always true, but we do this for TypeScript:
        if (!(root instanceof ShadowRoot)) {
            return;
        }
        const shadowRoot = root;
        function handler(e) {
            const el = shadowRoot.activeElement;
            if (e.key === 'Enter' && el instanceof HTMLElement && el.getAttribute('role') === 'link') {
                e.preventDefault();
                e.stopPropagation();
                el.click();
            }
        }
        shadowRoot.addEventListener('keydown', handler);
        return ()=>shadowRoot.removeEventListener('keydown', handler);
    }, [
        dialog
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        ref: onDialog,
        "data-nextjs-dialog": true,
        tabIndex: -1,
        role: "dialog",
        "aria-labelledby": props['aria-labelledby'],
        "aria-describedby": props['aria-describedby'],
        "aria-modal": "true"
    }, /*#__PURE__*/ React.createElement("div", {
        "data-nextjs-dialog-banner": true,
        className: `banner-${type}`
    }), children);
};
exports.Dialog = Dialog;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Dialog.js.map