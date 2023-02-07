"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFilesystemFrame = getFilesystemFrame;
exports.getErrorSource = getErrorSource;
exports.decorateServerError = decorateServerError;
exports.getServerError = getServerError;
var _extends = require("@swc/helpers/lib/_extends.js").default;
var _stacktraceParser = require("next/dist/compiled/stacktrace-parser");
function getFilesystemFrame(frame) {
    const f = _extends({}, frame);
    if (typeof f.file === 'string') {
        if (// Posix:
        f.file.startsWith('/') || // Win32:
        /^[a-z]:\\/i.test(f.file) || // Win32 UNC:
        f.file.startsWith('\\\\')) {
            f.file = `file://${f.file}`;
        }
    }
    return f;
}
const symbolError = Symbol('NextjsError');
function getErrorSource(error) {
    return error[symbolError] || null;
}
function decorateServerError(error, type) {
    Object.defineProperty(error, symbolError, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: type
    });
}
function getServerError(error, type) {
    let n;
    try {
        throw new Error(error.message);
    } catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = `${n.toString()}\n${(0, _stacktraceParser).parse(error.stack).map(getFilesystemFrame).map((f)=>{
            let str = `    at ${f.methodName}`;
            if (f.file) {
                let loc = f.file;
                if (f.lineNumber) {
                    loc += `:${f.lineNumber}`;
                    if (f.column) {
                        loc += `:${f.column}`;
                    }
                }
                str += ` (${loc})`;
            }
            return str;
        }).join('\n')}`;
    } catch (e1) {
        n.stack = error.stack;
    }
    decorateServerError(n, type);
    return n;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=nodeStackFrames.js.map