import type nodeZlib from "node:zlib";
import { ZlibCompress, ZLibDecompress } from "./_shared.mjs";
// Brotli Compression
export declare class BrotliCompress extends ZlibCompress {
	readonly _format = "brotli";
}
export declare const brotliCompress: typeof nodeZlib.brotliCompress;
export declare const createBrotliCompress: typeof nodeZlib.createBrotliCompress;
export declare const brotliCompressSync: typeof nodeZlib.brotliCompressSync;
// Brotli Decompression
export declare class BrotliDecompress extends ZLibDecompress {
	readonly _format = "brotli";
}
export declare const brotliDecompress: typeof nodeZlib.brotliDecompress;
export declare const createBrotliDecompress: typeof nodeZlib.createBrotliDecompress;
export declare const brotliDecompressSync: typeof nodeZlib.brotliDecompressSync;
