import { DisposableSymbols } from '@whatwg-node/disposablestack';
export declare class PonyfillIteratorObject<T> implements IteratorObject<T, undefined, unknown> {
    private iterableIterator;
    [Symbol.toStringTag]: string;
    constructor(iterableIterator: IterableIterator<T>, className: string);
    map<U>(callbackfn: (value: T, index: number) => U): Generator<U, undefined, unknown>;
    filter(callbackfn: (value: T, index: number) => boolean): Generator<T, undefined, unknown>;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue?: U): U;
    forEach(callbackfn: (value: T, index: number) => void): void;
    take(limit: number): Generator<T, undefined, unknown>;
    drop(count: number): IteratorObject<T, undefined, unknown>;
    flatMap<U>(callback: (value: T, index: number) => Iterator<U, unknown, undefined> | Iterable<U, unknown, undefined>): IteratorObject<U, undefined, unknown>;
    some(predicate: (value: T, index: number) => unknown): boolean;
    every(predicate: (value: T, index: number) => unknown): boolean;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    toArray(): T[];
    [DisposableSymbols.dispose](): void;
    next(...[value]: [] | [unknown]): IteratorResult<T, undefined>;
    [Symbol.iterator](): URLSearchParamsIterator<T>;
}
