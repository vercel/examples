// https://nodejs.org/api/buffer.html
import type nodeBuffer from "node:buffer";
export { kMaxLength, INSPECT_MAX_BYTES, SlowBuffer } from "./internal/buffer/buffer.mjs";
export declare const Buffer: unknown;
export { File } from "./internal/buffer/file.mjs";
// @ts-expect-eerror https://github.com/unjs/unenv/issues/64
export declare const Blob: typeof nodeBuffer.Blob;
export declare const resolveObjectURL: unknown;
export declare const transcode: unknown;
export declare const isUtf8: unknown;
export declare const isAscii: unknown;
export declare const btoa: unknown;
export declare const atob: unknown;
export declare const kStringMaxLength = 0;
export declare const constants: {};
declare const _default: {
	SlowBuffer: typeof nodeBuffer.SlowBuffer;
};
export default _default;
