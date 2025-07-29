export type MaybePromise<T> = Promise<T> | T;
export type MaybePromiseLike<T> = PromiseLike<T> | T;
export declare function isPromise<T>(value: MaybePromise<T>): value is Promise<T>;
export declare function isPromise<T>(value: MaybePromiseLike<T>): value is PromiseLike<T>;
export declare function isActualPromise<T>(value: MaybePromiseLike<T>): value is Promise<T>;
export declare function handleMaybePromise<TInput, TOutput>(inputFactory: () => MaybePromise<TInput>, outputSuccessFactory: (value: TInput) => MaybePromise<TOutput>, outputErrorFactory?: (err: any) => MaybePromise<TOutput>, finallyFactory?: () => MaybePromise<void>): MaybePromise<TOutput>;
export declare function handleMaybePromise<TInput, TOutput>(inputFactory: () => MaybePromiseLike<TInput>, outputSuccessFactory: (value: TInput) => MaybePromiseLike<TOutput>, outputErrorFactory?: (err: any) => MaybePromiseLike<TOutput>, finallyFactory?: () => MaybePromiseLike<void>): MaybePromiseLike<TOutput>;
export declare function fakePromise<T>(value: MaybePromise<T>): Promise<T>;
export declare function fakePromise<T>(value: MaybePromiseLike<T>): Promise<T>;
export declare function fakePromise(value: void): Promise<void>;
export interface DeferredPromise<T = void> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: any) => void;
}
export declare function createDeferredPromise<T = void>(): DeferredPromise<T>;
export { iterateAsync as iterateAsyncVoid };
export declare function iterateAsync<TInput, TOutput>(iterable: Iterable<TInput>, callback: (input: TInput, endEarly: () => void, index: number) => MaybePromise<TOutput | undefined | null | void>, results?: TOutput[]): MaybePromise<void>;
export declare function fakeRejectPromise<T>(error: unknown): Promise<T>;
/**
 * @deprecated Use `handleMaybePromise` instead.
 */
export declare function mapMaybePromise<TInput, TOutput>(input: MaybePromise<TInput>, onSuccess: (value: TInput) => MaybePromise<TOutput>, onError?: (err: any) => MaybePromise<TOutput>): MaybePromise<TOutput>;
export declare function mapMaybePromise<TInput, TOutput>(input: MaybePromiseLike<TInput>, onSuccess: (value: TInput) => MaybePromiseLike<TOutput>, onError?: (err: any) => MaybePromiseLike<TOutput>): MaybePromiseLike<TOutput>;
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export declare function mapAsyncIterator<T, U>(iterator: AsyncIterable<T> | AsyncIterator<T>, onNext: (value: T) => MaybePromise<U>, onError?: any, onEnd?: () => MaybePromise<void>): AsyncIterableIterator<U>;
export declare function promiseLikeFinally<T>(value: PromiseLike<T> | Promise<T>, onFinally: () => MaybePromiseLike<void>): PromiseLike<T>;
export declare function unfakePromise<T>(promise: Promise<T>): MaybePromise<T>;
