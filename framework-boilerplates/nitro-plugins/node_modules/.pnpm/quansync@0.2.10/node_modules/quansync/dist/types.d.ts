interface QuansyncOptions {
    onYield?: (value: any, isAsync: boolean) => any;
}
interface QuansyncInputObject<Return, Args extends any[]> extends QuansyncOptions {
    name?: string;
    sync: (...args: Args) => Return;
    async: (...args: Args) => Promise<Return>;
}
type QuansyncGeneratorFn<Return, Args extends any[]> = ((...args: Args) => QuansyncGenerator<Return>);
type QuansyncInput<Return, Args extends any[]> = QuansyncInputObject<Return, Args> | QuansyncGeneratorFn<Return, Args>;
type QuansyncGenerator<Return = any, Yield = unknown> = Generator<Yield, Return, Awaited<Yield>> & {
    __quansync?: true;
};
type QuansyncAwaitableGenerator<Return = any, Yield = unknown> = QuansyncGenerator<Return, Yield> & PromiseLike<Return>;
/**
 * "Superposition" function that can be consumed in both sync and async contexts.
 */
type QuansyncFn<Return = any, Args extends any[] = []> = ((...args: Args) => QuansyncAwaitableGenerator<Return>) & {
    sync: (...args: Args) => Return;
    async: (...args: Args) => Promise<Return>;
};

export type { QuansyncAwaitableGenerator, QuansyncFn, QuansyncGenerator, QuansyncGeneratorFn, QuansyncInput, QuansyncInputObject, QuansyncOptions };
