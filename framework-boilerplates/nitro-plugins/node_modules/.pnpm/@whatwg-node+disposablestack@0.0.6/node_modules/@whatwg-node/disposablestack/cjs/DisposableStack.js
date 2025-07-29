"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillDisposableStack = void 0;
const SupressedError_js_1 = require("./SupressedError.js");
const symbols_js_1 = require("./symbols.js");
const utils_js_1 = require("./utils.js");
const SuppressedError = globalThis.SuppressedError || SupressedError_js_1.PonyfillSuppressedError;
class PonyfillDisposableStack {
    callbacks = [];
    get disposed() {
        return this.callbacks.length === 0;
    }
    use(value) {
        if ((0, utils_js_1.isSyncDisposable)(value)) {
            this.callbacks.push(() => value[symbols_js_1.DisposableSymbols.dispose]());
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
        return this[symbols_js_1.DisposableSymbols.dispose]();
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
    [symbols_js_1.DisposableSymbols.dispose]() {
        this._iterateCallbacks();
        if (this._error) {
            const error = this._error;
            this._error = undefined;
            throw error;
        }
    }
    [Symbol.toStringTag] = 'DisposableStack';
}
exports.PonyfillDisposableStack = PonyfillDisposableStack;
