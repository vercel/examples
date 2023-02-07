import curry from "next/dist/compiled/lodash.curry";
export const loader = curry(function loader(rule, config) {
    var ref;
    if (!config.module) {
        config.module = {
            rules: []
        };
    }
    if (rule.oneOf) {
        var ref1;
        const existing = (ref1 = config.module.rules) == null ? void 0 : ref1.find((arrayRule)=>arrayRule && typeof arrayRule === "object" && arrayRule.oneOf);
        if (existing && typeof existing === "object") {
            existing.oneOf.push(...rule.oneOf);
            return config;
        }
    }
    (ref = config.module.rules) == null ? void 0 : ref.push(rule);
    return config;
});
export const unshiftLoader = curry(function unshiftLoader(rule, config) {
    var ref;
    if (!config.module) {
        config.module = {
            rules: []
        };
    }
    if (rule.oneOf) {
        var ref2;
        const existing = (ref2 = config.module.rules) == null ? void 0 : ref2.find((arrayRule)=>arrayRule && typeof arrayRule === "object" && arrayRule.oneOf);
        if (existing && typeof existing === "object") {
            var ref3;
            (ref3 = existing.oneOf) == null ? void 0 : ref3.unshift(...rule.oneOf);
            return config;
        }
    }
    (ref = config.module.rules) == null ? void 0 : ref.unshift(rule);
    return config;
});
export const plugin = curry(function plugin(p, config) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(p);
    return config;
});

//# sourceMappingURL=helpers.js.map