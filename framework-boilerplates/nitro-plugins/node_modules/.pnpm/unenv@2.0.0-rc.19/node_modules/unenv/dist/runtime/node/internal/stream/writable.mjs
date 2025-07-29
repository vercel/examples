import { EventEmitter } from "node:events";
// Docs: https://nodejs.org/api/stream.html#stream_writable_streams
// Implementation: https://github.com/nodejs/node/blob/master/lib/internal/streams/writable.js
class _Writable extends EventEmitter {
	__unenv__ = true;
	writable = true;
	writableEnded = false;
	writableFinished = false;
	writableHighWaterMark = 0;
	writableLength = 0;
	writableObjectMode = false;
	writableCorked = 0;
	closed = false;
	errored = null;
	writableNeedDrain = false;
	destroyed = false;
	_data;
	_encoding = "utf-8";
	constructor(_opts) {
		super();
	}
	pipe(_destenition, _options) {
		return {};
	}
	_write(chunk, encoding, callback) {
		if (this.writableEnded) {
			if (callback) {
				callback();
			}
			return;
		}
		if (this._data === undefined) {
			this._data = chunk;
		} else {
			const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
			const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
			this._data = Buffer.concat([a, b]);
		}
		this._encoding = encoding;
		if (callback) {
			callback();
		}
	}
	_writev(_chunks, _callback) {}
	_destroy(_error, _callback) {}
	_final(_callback) {}
	write(chunk, arg2, arg3) {
		const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
		const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
		this._write(chunk, encoding, cb);
		return true;
	}
	setDefaultEncoding(_encoding) {
		return this;
	}
	end(arg1, arg2, arg3) {
		const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
		if (this.writableEnded) {
			if (callback) {
				callback();
			}
			return this;
		}
		const data = arg1 === callback ? undefined : arg1;
		if (data) {
			const encoding = arg2 === callback ? undefined : arg2;
			this.write(data, encoding, callback);
		}
		this.writableEnded = true;
		this.writableFinished = true;
		this.emit("close");
		this.emit("finish");
		return this;
	}
	cork() {}
	uncork() {}
	destroy(_error) {
		this.destroyed = true;
		delete this._data;
		this.removeAllListeners();
		return this;
	}
	compose(stream, options) {
		throw new Error("[h3] Method not implemented.");
	}
}
export const Writable = globalThis.Writable || _Writable;
