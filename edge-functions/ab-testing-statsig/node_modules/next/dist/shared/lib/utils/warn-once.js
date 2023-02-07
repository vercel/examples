"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warnOnce = void 0;
let warnOnce = (_)=>{};
if (process.env.NODE_ENV !== 'production') {
    const warnings = new Set();
    exports.warnOnce = warnOnce = (msg)=>{
        if (!warnings.has(msg)) {
            console.warn(msg);
        }
        warnings.add(msg);
    };
}
exports.warnOnce = warnOnce;

//# sourceMappingURL=warn-once.js.map