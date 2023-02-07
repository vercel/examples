"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cached = cached;
function cached(generate) {
    let cache = undefined;
    return (key)=>{
        if ((cache == null ? void 0 : cache.key) !== key) {
            cache = {
                key,
                value: generate(key)
            };
        }
        return cache.value;
    };
}

//# sourceMappingURL=cached.js.map