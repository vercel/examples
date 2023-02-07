"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShadowPortal = ShadowPortal;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var React = _interop_require_wildcard(require("react"));
var _reactDom = require("react-dom");
function ShadowPortal({ children  }) {
    let portalNode = React.useRef(null);
    let shadowNode = React.useRef(null);
    let [, forceUpdate] = React.useState();
    React.useLayoutEffect(()=>{
        const ownerDocument = document;
        portalNode.current = ownerDocument.createElement('nextjs-portal');
        shadowNode.current = portalNode.current.attachShadow({
            mode: 'open'
        });
        ownerDocument.body.appendChild(portalNode.current);
        forceUpdate({});
        return ()=>{
            if (portalNode.current && portalNode.current.ownerDocument) {
                portalNode.current.ownerDocument.body.removeChild(portalNode.current);
            }
        };
    }, []);
    return shadowNode.current ? /*#__PURE__*/ (0, _reactDom).createPortal(children, shadowNode.current) : null;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=ShadowPortal.js.map