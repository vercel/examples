import { notImplemented } from "../../../../_internal/utils.mjs";
import { ZlibCompress } from "./_shared.mjs";
// Zip Decompression
export class Unzip extends ZlibCompress {
	_format = "zip";
}
export const createUnzip = () => new Unzip();
export const unzip = /* @__PURE__ */ notImplemented("zlib.unzip");
export const unzipSync = /* @__PURE__ */ notImplemented("zlib.unzipSync");
