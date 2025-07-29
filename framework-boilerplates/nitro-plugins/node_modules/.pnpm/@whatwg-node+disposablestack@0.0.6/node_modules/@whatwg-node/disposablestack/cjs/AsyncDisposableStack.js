"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillAsyncDisposableStack = void 0;
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
const SupressedError_js_1 = require("./SupressedError.js");
const symbols_js_1 = require("./symbols.js");
const utils_js_1 = require("./utils.js");
const SuppressedError = globalThis.SuppressedError || SupressedError_js_1.PonyfillSuppressedError;
class PonyfillAsyncDisposableStack {
    callbacks = [];
    get disposed() {
        return this.callbacks.length === 0;
    }
    use(value) {
        if ((0, utils_js_1.isAsyncDisposable)(value)) {
            this.callbacks.push(() => value[symbols_js_1.DisposableSymbols.asyncDispose]());
        }
        else if ((0, utils_js_1.isSyncDisposable)(value)) {
            this.callbacks.push(() => value[symbols_js_1.DisposableSymbols.dispose]());
        }
        return value;
    }
    adopt(value, onDisposeAsync) {
        if (onDisposeAsync) {
            this.callbacks.push(() => onDisposeAsync(value));
        }
        return value;
    }
    defer(onDisposeAsync) {
        if (onDisposeAsync) {
            this.callbacks.push(onDisposeAsync);
        }
    }
    move() {
        const stack = new PonyfillAsyncDisposableStack();
        stack.callbacks = this.callbacks;
        this.callbacks = [];
        return stack;
    }
    disposeAsync() {
        return this[symbols_js_1.DisposableSymbols.asyncDispose]();
    }
    _error;
    _iterateCallbacks() {
        const cb = this.callbacks.pop();
        if (cb) {
            return (0, promise_helpers_1.handleMaybePromise)(cb, () => this._iterateCallbacks(), error => {
                this._error = this._error ? new SuppressedError(error, this._error) : error;
                return this._iterateCallbacks();
            });
        }
    }
    [symbols_js_1.DisposableSymbols.asyncDispose]() {
        const res$ = this._iterateCallbacks();
        if (res$?.then) {
            return res$.then(() => {
                if (this._error) {
                    const error = this._error;
                    this._error = undefined;
                    throw error;
                }
            });
        }
        if (this._error) {
            const error = this._error;
            this._error = undefined;
            throw error;
        }
        return undefined;
    }
    [Symbol.toStringTag] = 'AsyncDisposableStack';
}
exports.PonyfillAsyncDisposableStack = PonyfillAsyncDisposableStack;
