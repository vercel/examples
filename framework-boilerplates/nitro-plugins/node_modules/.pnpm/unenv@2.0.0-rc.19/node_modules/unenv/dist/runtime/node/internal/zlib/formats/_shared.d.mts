import type nodeZlib from "node:zlib";
import { Transform, type TransformOptions } from "node:stream";
// Compression
export declare abstract class ZlibCompress extends Transform {
	readonly __unenv__: true;
	readonly bytesRead = 0;
	readonly bytesWritten = 0;
	abstract readonly _format: undefined | "deflate" | "gzip" | "zlib" | "brotli" | "zip";
	constructor(opts?: TransformOptions);
	close(callback?: () => void);
	flush(kind?: number | undefined, callback?: (() => void) | undefined): void;
	flush(callback?: (() => void) | undefined): void;
}
// Decompression
export declare abstract class ZLibDecompress extends ZlibCompress {}
// Mock Compress/Decompress Function factory
export interface CompressFunction {
	(buf: nodeZlib.InputType, options?: any, callback?: nodeZlib.CompressCallback): void;
	(buf: Buffer, callback?: nodeZlib.CompressCallback): void;
	__promisify__(buffer: nodeZlib.InputType, options?: any): Promise<Buffer>;
}
export declare function notImplementedCompress(format: string): CompressFunction;
