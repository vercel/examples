"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = NoopHead;
var _warnOnce = require("../../shared/lib/utils/warn-once");
function NoopHead() {
    return null;
}
if (process.env.NODE_ENV !== 'production') {
    (0, _warnOnce).warnOnce(`You're using \`next/head\` inside app directory, please migrate to \`head.js\`. Checkout https://beta.nextjs.org/docs/api-reference/file-conventions/head for details.`);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=noop-head.js.map