"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = noop;
function noop(strings, ...keys) {
    const lastIndex = strings.length - 1;
    return strings.slice(0, lastIndex).reduce((p, s, i)=>p + s + keys[i], '') + strings[lastIndex];
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=noop-template.js.map