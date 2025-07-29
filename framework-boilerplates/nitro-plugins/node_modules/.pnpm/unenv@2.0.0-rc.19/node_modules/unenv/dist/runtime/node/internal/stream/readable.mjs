import { createNotImplementedError } from "../../../_internal/utils.mjs";
import { EventEmitter } from "node:events";
export class _Readable extends EventEmitter {
	__unenv__ = true;
	readableEncoding = null;
	readableEnded = true;
	readableFlowing = false;
	readableHighWaterMark = 0;
	readableLength = 0;
	readableObjectMode = false;
	readableAborted = false;
	readableDidRead = false;
	closed = false;
	errored = null;
	readable = false;
	destroyed = false;
	static from(_iterable, options) {
		return new _Readable(options);
	}
	constructor(_opts) {
		super();
	}
	_read(_size) {}
	read(_size) {}
	setEncoding(_encoding) {
		return this;
	}
	pause() {
		return this;
	}
	resume() {
		return this;
	}
	isPaused() {
		return true;
	}
	unpipe(_destination) {
		return this;
	}
	unshift(_chunk, _encoding) {}
	wrap(_oldStream) {
		return this;
	}
	push(_chunk, _encoding) {
		return false;
	}
	_destroy(_error, _callback) {
		this.removeAllListeners();
	}
	destroy(error) {
		this.destroyed = true;
		this._destroy(error);
		return this;
	}
	pipe(_destenition, _options) {
		return {};
	}
	compose(stream, options) {
		throw new Error("[unenv] Method not implemented.");
	}
	[Symbol.asyncDispose]() {
		this.destroy();
		return Promise.resolve();
	}
	// eslint-disable-next-line require-yield
	async *[Symbol.asyncIterator]() {
		throw createNotImplementedError("Readable.asyncIterator");
	}
	iterator(options) {
		throw createNotImplementedError("Readable.iterator");
	}
	map(fn, options) {
		throw createNotImplementedError("Readable.map");
	}
	filter(fn, options) {
		throw createNotImplementedError("Readable.filter");
	}
	forEach(fn, options) {
		throw createNotImplementedError("Readable.forEach");
	}
	reduce(fn, initialValue, options) {
		throw createNotImplementedError("Readable.reduce");
	}
	find(fn, options) {
		throw createNotImplementedError("Readable.find");
	}
	findIndex(fn, options) {
		throw createNotImplementedError("Readable.findIndex");
	}
	some(fn, options) {
		throw createNotImplementedError("Readable.some");
	}
	toArray(options) {
		throw createNotImplementedError("Readable.toArray");
	}
	every(fn, options) {
		throw createNotImplementedError("Readable.every");
	}
	flatMap(fn, options) {
		throw createNotImplementedError("Readable.flatMap");
	}
	drop(limit, options) {
		throw createNotImplementedError("Readable.drop");
	}
	take(limit, options) {
		throw createNotImplementedError("Readable.take");
	}
	asIndexedPairs(options) {
		throw createNotImplementedError("Readable.asIndexedPairs");
	}
}
export const Readable = globalThis.Readable || _Readable;
