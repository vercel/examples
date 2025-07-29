"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisposableSymbols = void 0;
exports.patchSymbols = patchSymbols;
exports.DisposableSymbols = {
    get dispose() {
        return Symbol.dispose || Symbol.for('dispose');
    },
    get asyncDispose() {
        return Symbol.asyncDispose || Symbol.for('asyncDispose');
    },
};
function patchSymbols() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - we ponyfill these symbols
    Symbol.dispose ||= Symbol.for('dispose');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - we ponyfill these symbols
    Symbol.asyncDispose ||= Symbol.for('asyncDispose');
}
