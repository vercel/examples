import { Transform } from "node:stream";
import { createNotImplementedError } from "../../../../_internal/utils.mjs";
// Compression
export class ZlibCompress extends Transform {
	__unenv__ = true;
	bytesRead = 0;
	bytesWritten = 0;
	constructor(opts) {
		super(opts);
		throw createNotImplementedError("zlib is not implemented yet!");
	}
	close(callback) {
		if (typeof callback === "function") {
			callback();
		}
	}
	flush(kind, callback) {
		if (typeof callback === "function") {
			callback();
		}
	}
}
// Decompression
export class ZLibDecompress extends ZlibCompress {}
export function notImplementedCompress(format) {
	const fn = function(_buf, arg2, arg3) {
		const cb = typeof arg2 === "function" ? arg2 : arg3;
		const err = new Error(`[unenv] zlib ${format} compression not supported.`);
		if (typeof cb === "function") {
			cb(err, Buffer.from(""));
		} else {
			throw err;
		}
	};
	return Object.assign(fn, { __promisify__: (buffer, options) => {
		return new Promise((resolve, reject) => {
			fn(buffer, options, (err, result) => err ? reject(err) : resolve(result));
		});
	} });
}
