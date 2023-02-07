/**
 * A simple caching behavior.
 * We cache the result based on the key `K`
 * which uses referential equality, to avoid re-computing
 * the result for the same key.
 */ export function cached(generate) {
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