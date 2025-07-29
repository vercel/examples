import { createNotImplementedError } from "../../../../_internal/utils.mjs";
import { notImplemented } from "../../../../_internal/utils.mjs";
import { ZlibCompress, ZLibDecompress, notImplementedCompress } from "./_shared.mjs";
// Deflate Compression
export class Deflate extends ZlibCompress {
	_format = "deflate";
	params(level, strategy, callback) {
		throw createNotImplementedError("Deflate.params");
	}
	reset() {
		throw createNotImplementedError("Deflate.reset");
	}
}
export const deflate = notImplementedCompress("deflate");
export const createDeflate = () => new Deflate();
export const deflateSync = /* @__PURE__ */ notImplemented("zlib.deflateSync");
// Deflate Decompress(Inflate)
export class Inflate extends ZLibDecompress {
	_format = "deflate";
	reset() {
		throw createNotImplementedError("Inflate.reset");
	}
}
export const inflate = notImplementedCompress("inflate");
export const createInflate = () => new Inflate();
export const inflateSync = /* @__PURE__ */ notImplemented("zlib.inflateSync");
// Deflate Raw Compression
export class DeflateRaw extends Deflate {}
export const deflateRaw = notImplementedCompress("deflateRaw");
export const createDeflateRaw = () => new DeflateRaw();
export const deflateRawSync = /* @__PURE__ */ notImplemented("zlib.deflateRawSync");
// Inflate Raw Decompress (Inflate Raw)
export class InflateRaw extends Inflate {}
export const inflateRaw = notImplementedCompress("inflateRaw");
export const createInflateRaw = () => new InflateRaw();
export const inflateRawSync = /* @__PURE__ */ notImplemented("zlib.inflateRawSync");
