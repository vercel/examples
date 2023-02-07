"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setRequireOverrides = setRequireOverrides;
exports.loadRequireHook = loadRequireHook;
exports.overrideBuiltInReactPackages = overrideBuiltInReactPackages;
// sync injects a hook for webpack and webpack/... requires to use the internal ncc webpack version
// this is in order for userland plugins to attach to the same webpack instance as next.js
// the individual compiled modules are as defined for the compilation in bundles/webpack/packages/*
const hookPropertyMap = new Map();
let initialized = false;
function setupResolve() {
    if (initialized) {
        return;
    }
    initialized = true;
    const mod = require("module");
    const resolveFilename = mod._resolveFilename;
    mod._resolveFilename = function(request, parent, isMain, options) {
        const hookResolved = hookPropertyMap.get(request);
        if (hookResolved) request = hookResolved;
        return resolveFilename.call(mod, request, parent, isMain, options);
    };
}
function setRequireOverrides(aliases) {
    for (const [key, value] of aliases){
        hookPropertyMap.set(key, value);
    }
}
function loadRequireHook(aliases = []) {
    const defaultAliases = [
        ...aliases,
        // Use `require.resolve` explicitly to make them statically analyzable
        [
            "styled-jsx",
            require.resolve("styled-jsx")
        ],
        [
            "styled-jsx/style",
            require.resolve("styled-jsx/style")
        ],
        [
            "styled-jsx/style",
            require.resolve("styled-jsx/style")
        ], 
    ];
    setRequireOverrides(defaultAliases);
    setupResolve();
}
function overrideBuiltInReactPackages() {
    setRequireOverrides([
        [
            "react",
            require.resolve("next/dist/compiled/react")
        ],
        [
            "react/jsx-runtime",
            require.resolve("next/dist/compiled/react/jsx-runtime"), 
        ],
        [
            "react/jsx-dev-runtime",
            require.resolve("next/dist/compiled/react/jsx-dev-runtime"), 
        ],
        [
            "react-dom",
            require.resolve("next/dist/compiled/react-dom/server-rendering-stub"), 
        ],
        [
            "react-dom/client",
            require.resolve("next/dist/compiled/react-dom/client"), 
        ],
        [
            "react-dom/server",
            require.resolve("next/dist/compiled/react-dom/server"), 
        ],
        [
            "react-dom/server.browser",
            require.resolve("next/dist/compiled/react-dom/server.browser"), 
        ], 
    ]);
}

//# sourceMappingURL=require-hook.js.map