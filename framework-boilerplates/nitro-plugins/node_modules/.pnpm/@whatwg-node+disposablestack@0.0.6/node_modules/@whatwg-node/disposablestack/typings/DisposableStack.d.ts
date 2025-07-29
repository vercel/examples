import { DisposableSymbols } from './symbols.js';
export declare class PonyfillDisposableStack implements DisposableStack {
    private callbacks;
    get disposed(): boolean;
    use<T extends Disposable | null | undefined>(value: T): T;
    adopt<T>(value: T, onDispose: (value: T) => void): T;
    defer(onDispose: () => void): void;
    move(): DisposableStack;
    dispose(): void;
    private _error?;
    private _iterateCallbacks;
    [DisposableSymbols.dispose](): void;
    readonly [Symbol.toStringTag]: string;
}
