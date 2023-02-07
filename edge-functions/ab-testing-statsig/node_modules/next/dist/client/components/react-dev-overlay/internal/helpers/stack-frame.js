"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOriginalStackFrame = getOriginalStackFrame;
exports.getOriginalStackFrames = getOriginalStackFrames;
exports.getFrameSource = getFrameSource;
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
function getOriginalStackFrame(source, type, errorMessage) {
    var ref7, ref1;
    function _getOriginalStackFrame() {
        return __getOriginalStackFrame.apply(this, arguments);
    }
    function __getOriginalStackFrame() {
        __getOriginalStackFrame = _async_to_generator(function*() {
            var ref, ref4, ref5;
            const params = new URLSearchParams();
            params.append('isServer', String(type === 'server'));
            params.append('isEdgeServer', String(type === 'edge-server'));
            params.append('isAppDirectory', 'true');
            params.append('errorMessage', errorMessage);
            for(const key in source){
                var _key;
                params.append(key, ((_key = source[key]) != null ? _key : '').toString());
            }
            const controller = new AbortController();
            const tm = setTimeout(()=>controller.abort(), 3000);
            const res = yield self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH || ''}/__nextjs_original-stack-frame?${params.toString()}`, {
                signal: controller.signal
            }).finally(()=>{
                clearTimeout(tm);
            });
            if (!res.ok || res.status === 204) {
                return Promise.reject(new Error((yield res.text())));
            }
            const body = yield res.json();
            var /* collapsed */ ref6;
            return {
                error: false,
                reason: null,
                external: false,
                expanded: !Boolean((ref6 = (((ref = source.file) == null ? void 0 : ref.includes('node_modules')) || ((ref4 = body.originalStackFrame) == null ? void 0 : (ref5 = ref4.file) == null ? void 0 : ref5.includes('node_modules')))) != null ? ref6 : true),
                sourceStackFrame: source,
                originalStackFrame: body.originalStackFrame,
                originalCodeFrame: body.originalCodeFrame || null
            };
        });
        return __getOriginalStackFrame.apply(this, arguments);
    }
    if (!(((ref7 = source.file) == null ? void 0 : ref7.startsWith('webpack-internal:')) || ((ref1 = source.file) == null ? void 0 : ref1.startsWith('file:')))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    }
    var ref2, ref3;
    return _getOriginalStackFrame().catch((err)=>{
        return {
            error: true,
            reason: (ref3 = (ref2 = err == null ? void 0 : err.message) != null ? ref2 : err == null ? void 0 : err.toString()) != null ? ref3 : 'Unknown Error',
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        };
    });
}
function getOriginalStackFrames(frames, type, errorMessage) {
    return Promise.all(frames.map((frame)=>getOriginalStackFrame(frame, type, errorMessage)));
}
function getFrameSource(frame) {
    let str = '';
    try {
        var ref;
        const u = new URL(frame.file);
        // Strip the origin for same-origin scripts.
        if (typeof globalThis !== 'undefined' && ((ref = globalThis.location) == null ? void 0 : ref.origin) !== u.origin) {
            // URLs can be valid without an `origin`, so long as they have a
            // `protocol`. However, `origin` is preferred.
            if (u.origin === 'null') {
                str += u.protocol;
            } else {
                str += u.origin;
            }
        }
        // Strip query string information as it's typically too verbose to be
        // meaningful.
        str += u.pathname;
        str += ' ';
    } catch (e) {
        str += (frame.file || '(unknown)') + ' ';
    }
    if (frame.lineNumber != null) {
        if (frame.column != null) {
            str += `(${frame.lineNumber}:${frame.column}) `;
        } else {
            str += `(${frame.lineNumber}) `;
        }
    }
    return str.slice(0, -1);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=stack-frame.js.map