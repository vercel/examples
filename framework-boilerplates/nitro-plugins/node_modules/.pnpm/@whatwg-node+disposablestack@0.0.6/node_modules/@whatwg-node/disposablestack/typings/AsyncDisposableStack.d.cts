import { type MaybePromiseLike } from '@whatwg-node/promise-helpers';
import { DisposableSymbols } from './symbols.cjs';
export declare class PonyfillAsyncDisposableStack implements AsyncDisposableStack {
    private callbacks;
    get disposed(): boolean;
    use<T extends AsyncDisposable | Disposable | null | undefined>(value: T): T;
    adopt<T>(value: T, onDisposeAsync: (value: T) => MaybePromiseLike<void>): T;
    defer(onDisposeAsync: () => MaybePromiseLike<void>): void;
    move(): AsyncDisposableStack;
    disposeAsync(): Promise<void>;
    private _error?;
    private _iterateCallbacks;
    [DisposableSymbols.asyncDispose](): Promise<void>;
    readonly [Symbol.toStringTag]: string;
}
