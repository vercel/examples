"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseStack = parseStack;
var _stacktraceParser = require("next/dist/compiled/stacktrace-parser");
const regexNextStatic = /\/_next(\/static\/.+)/g;
function parseStack(stack) {
    const frames = (0, _stacktraceParser).parse(stack);
    return frames.map((frame)=>{
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                var ref, ref1;
                const distDir = (ref1 = (ref = process.env.__NEXT_DIST_DIR) == null ? void 0 : ref.replace(/\\/g, '/')) == null ? void 0 : ref1.replace(/\/$/, '');
                if (distDir) {
                    frame.file = 'file://' + distDir.concat(res.pop());
                }
            }
        } catch (e) {}
        return frame;
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=parseStack.js.map