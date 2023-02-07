"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRouter = useRouter;
var _react = require("react");
var _routerContext = require("../../shared/lib/router-context");
function useRouter() {
    return (0, _react).useContext(_routerContext.RouterContext);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=router.js.map