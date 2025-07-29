import { notImplemented } from "../../../../_internal/utils.mjs";
import { ZlibCompress, ZLibDecompress, notImplementedCompress } from "./_shared.mjs";
// Gzip Compression
export class Gzip extends ZlibCompress {
	_format = "gzip";
}
export const gzip = notImplementedCompress("gzip");
export const createGzip = () => new Gzip();
export const gzipSync = /* @__PURE__ */ notImplemented("zlib.gzipSync");
// Gzip Decompression
export class Gunzip extends ZLibDecompress {
	_format = "gzip";
}
export const gunzip = notImplementedCompress("gunzip");
export const createGunzip = () => new Gunzip();
export const gunzipSync = /* @__PURE__ */ notImplemented("zlib.gunzipSync");
