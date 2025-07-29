import {Options as TimeoutOptions} from 'p-timeout';

export interface Options<ResolveValueType> {
	/**
	Number of milliseconds to wait after `condition` resolves to `false` before calling it again.

	@default 20
	*/
	readonly interval?: number;

	/**
	Number of milliseconds to wait before automatically rejecting with a `TimeoutError`.

	You can customize the timeout `Error` by specifying `TimeoutOptions`.

	@default Infinity

	@example
	```
	import pWaitFor from 'p-wait-for';
	import {pathExists} from 'path-exists';

	const originalSetTimeout = setTimeout;
	const originalClearTimeout = clearTimeout;

	sinon.useFakeTimers();

	await pWaitFor(() => pathExists('unicorn.png'), {
		timeout: {
			milliseconds: 100,
			message: new MyError('Time’s up!'),
			customTimers: {
				setTimeout: originalSetTimeout,
				clearTimeout: originalClearTimeout
			}
		}
	});

	console.log('Yay! The file now exists.');
	```
	*/
	readonly timeout?: number | TimeoutOptions<ResolveValueType>; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

	/**
	Whether to run the check immediately rather than starting by waiting `interval` milliseconds.

	Useful for when the check, if run immediately, would likely return `false`. In this scenario, set `before` to `false`.

	@default true
	*/
	readonly before?: boolean;
}

// https://github.com/sindresorhus/type-fest/blob/043b732bf02c2b700245aa6501116a6646d50732/source/opaque.d.ts
declare const resolveValueSymbol: unique symbol;

interface ResolveValue<ResolveValueType> {
	[resolveValueSymbol]: ResolveValueType;
}

declare const pWaitFor: {
	/**
	Wait for a condition to be true.

	@returns A promise that resolves when `condition` returns `true`. Rejects if `condition` throws or returns a `Promise` that rejects.

	@example
	```
	import pWaitFor from 'p-wait-for';
	import {pathExists} from 'path-exists';

	await pWaitFor(() => pathExists('unicorn.png'));
	console.log('Yay! The file now exists.');
	```
	*/
	<ResolveValueType>(condition: () => PromiseLike<boolean | ResolveValue<ResolveValueType>> | PromiseLike<boolean> | boolean | ResolveValue<ResolveValueType> | PromiseLike<ResolveValue<ResolveValueType>>, options?: Options<ResolveValueType>): Promise<ResolveValueType>;

	/**
	Resolve the main promise with a custom value.

	@example
	```
	import pWaitFor from 'p-wait-for';
	import pathExists from 'path-exists';

	const path = await pWaitFor(async () => {
		const path = getPath();
		return await pathExists(path) && pWaitFor.resolveWith(path);
	});

	console.log(path);
	```
	*/
	resolveWith<ValueType>(value: ValueType): ResolveValue<ValueType>;
};

export default pWaitFor;

export {TimeoutError} from 'p-timeout';
