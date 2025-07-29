import { PonyfillSuppressedError } from './SupressedError.js';
import { DisposableSymbols } from './symbols.js';
import { isSyncDisposable } from './utils.js';
const SuppressedError = globalThis.SuppressedError || PonyfillSuppressedError;
export class PonyfillDisposableStack {
    callbacks = [];
    get disposed() {
        return this.callbacks.length === 0;
    }
    use(value) {
        if (isSyncDisposable(value)) {
            this.callbacks.push(() => value[DisposableSymbols.dispose]());
        }
        return value;
    }
    adopt(value, onDispose) {
        if (onDispose) {
            this.callbacks.push(() => onDispose(value));
        }
        return value;
    }
    defer(onDispose) {
        if (onDispose) {
            this.callbacks.push(onDispose);
        }
    }
    move() {
        const stack = new PonyfillDisposableStack();
        stack.callbacks = this.callbacks;
        this.callbacks = [];
        return stack;
    }
    dispose() {
        return this[DisposableSymbols.dispose]();
    }
    _error;
    _iterateCallbacks() {
        const cb = this.callbacks.pop();
        if (cb) {
            try {
                cb();
            }
            catch (error) {
                this._error = this._error ? new SuppressedError(error, this._error) : error;
            }
            return this._iterateCallbacks();
        }
    }
    [DisposableSymbols.dispose]() {
        this._iterateCallbacks();
        if (this._error) {
            const error = this._error;
            this._error = undefined;
            throw error;
        }
    }
    [Symbol.toStringTag] = 'DisposableStack';
}
