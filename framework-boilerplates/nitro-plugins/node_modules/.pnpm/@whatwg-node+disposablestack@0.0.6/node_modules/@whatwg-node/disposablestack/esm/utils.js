import { DisposableSymbols } from './symbols.js';
export function isSyncDisposable(obj) {
    return obj?.[DisposableSymbols.dispose] != null;
}
export function isAsyncDisposable(obj) {
    return obj?.[DisposableSymbols.asyncDispose] != null;
}
