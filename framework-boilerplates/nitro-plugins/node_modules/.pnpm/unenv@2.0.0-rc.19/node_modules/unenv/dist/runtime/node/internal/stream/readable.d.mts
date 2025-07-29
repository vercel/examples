import type nodeStream from "node:stream";
import type { BufferEncoding, Callback } from "../../../_internal/types.mjs";
import { EventEmitter } from "node:events";
// Docs: https://nodejs.org/api/stream.html#stream_readable_streams
// Implementation: https://github.com/nodejs/node/blob/master/lib/internal/streams/readable.js
interface ArrayOptions {
	/** the maximum concurrent invocations of `fn` to call on the stream at once. **Default: 1**. */
	concurrency?: number;
	/** allows destroying the stream if the signal is aborted. */
	signal?: AbortSignal;
}
export declare class _Readable extends EventEmitter implements nodeStream.Readable {
	__unenv__: unknown;
	readonly readableEncoding: BufferEncoding | null;
	readonly readableEnded: boolean;
	readonly readableFlowing: boolean | null;
	readonly readableHighWaterMark: number;
	readonly readableLength: number;
	readonly readableObjectMode: boolean;
	readonly readableAborted: boolean;
	readonly readableDidRead: boolean;
	readonly closed: boolean;
	readonly errored: Error | null;
	readable: boolean;
	destroyed: boolean;
	static from(_iterable: Iterable<any> | AsyncIterable<any>, options?: nodeStream.ReadableOptions);
	constructor(_opts?: nodeStream.ReadableOptions);
	_read(_size: number);
	read(_size?: number);
	setEncoding(_encoding: BufferEncoding);
	pause();
	resume();
	isPaused(): boolean;
	unpipe(_destination?: any);
	unshift(_chunk: any, _encoding?: BufferEncoding);
	wrap(_oldStream: any);
	push(_chunk: any, _encoding?: BufferEncoding): boolean;
	_destroy(_error?: any, _callback?: Callback<any>);
	destroy(error?: Error);
	pipe<T>(_destenition: T, _options?: {
		end?: boolean;
	}): T;
	compose<T extends NodeJS.ReadableStream>(stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>, options?: {
		signal: AbortSignal;
	} | undefined): T;
	[Symbol.asyncDispose]();
	// eslint-disable-next-line require-yield
	[Symbol.asyncIterator](): NodeJS.AsyncIterator<any>;
	iterator(options?: {
		destroyOnReturn?: boolean | undefined;
	} | undefined): NodeJS.AsyncIterator<any>;
	map(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, options?: ArrayOptions | undefined): nodeStream.Readable;
	filter(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, options?: ArrayOptions | undefined): nodeStream.Readable;
	forEach(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => void | Promise<void>, options?: ArrayOptions | undefined): Promise<void>;
	reduce(fn: (accumulator: any, data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, initialValue?: any, options?: ArrayOptions | undefined): Promise<any>;
	find(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, options?: ArrayOptions | undefined): Promise<any>;
	findIndex(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, options?: ArrayOptions | undefined): Promise<number>;
	some(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean, options?: ArrayOptions | undefined): Promise<boolean>;
	toArray(options?: Pick<ArrayOptions, "signal"> | undefined): Promise<any[]>;
	every(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => boolean | Promise<boolean>, options?: ArrayOptions | undefined): Promise<boolean>;
	flatMap(fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any, options?: ArrayOptions | undefined): nodeStream.Readable;
	drop(limit: number, options?: Pick<ArrayOptions, "signal"> | undefined): nodeStream.Readable;
	take(limit: number, options?: Pick<ArrayOptions, "signal"> | undefined): nodeStream.Readable;
	asIndexedPairs(options?: Pick<ArrayOptions, "signal"> | undefined): nodeStream.Readable;
}
export declare const Readable: typeof nodeStream.Readable;
export {};
