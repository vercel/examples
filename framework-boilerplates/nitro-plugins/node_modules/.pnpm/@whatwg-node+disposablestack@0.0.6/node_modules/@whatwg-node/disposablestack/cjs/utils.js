"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSyncDisposable = isSyncDisposable;
exports.isAsyncDisposable = isAsyncDisposable;
const symbols_js_1 = require("./symbols.js");
function isSyncDisposable(obj) {
    return obj?.[symbols_js_1.DisposableSymbols.dispose] != null;
}
function isAsyncDisposable(obj) {
    return obj?.[symbols_js_1.DisposableSymbols.asyncDispose] != null;
}
