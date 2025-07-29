import { handleMaybePromise } from '@whatwg-node/promise-helpers';
import { PonyfillSuppressedError } from './SupressedError.js';
import { DisposableSymbols } from './symbols.js';
import { isAsyncDisposable, isSyncDisposable } from './utils.js';
const SuppressedError = globalThis.SuppressedError || PonyfillSuppressedError;
export class PonyfillAsyncDisposableStack {
    callbacks = [];
    get disposed() {
        return this.callbacks.length === 0;
    }
    use(value) {
        if (isAsyncDisposable(value)) {
            this.callbacks.push(() => value[DisposableSymbols.asyncDispose]());
        }
        else if (isSyncDisposable(value)) {
            this.callbacks.push(() => value[DisposableSymbols.dispose]());
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
        return this[DisposableSymbols.asyncDispose]();
    }
    _error;
    _iterateCallbacks() {
        const cb = this.callbacks.pop();
        if (cb) {
            return handleMaybePromise(cb, () => this._iterateCallbacks(), error => {
                this._error = this._error ? new SuppressedError(error, this._error) : error;
                return this._iterateCallbacks();
            });
        }
    }
    [DisposableSymbols.asyncDispose]() {
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
