import type nodeZlib from "node:zlib";
import { ZlibCompress, ZLibDecompress } from "./_shared.mjs";
// Gzip Compression
export declare class Gzip extends ZlibCompress {
	readonly _format = "gzip";
}
export declare const gzip: typeof nodeZlib.gzip;
export declare const createGzip: typeof nodeZlib.createGzip;
export declare const gzipSync: typeof nodeZlib.gzipSync;
// Gzip Decompression
export declare class Gunzip extends ZLibDecompress {
	readonly _format = "gzip";
}
export declare const gunzip: typeof nodeZlib.gunzip;
export declare const createGunzip: typeof nodeZlib.createGunzip;
export declare const gunzipSync: typeof nodeZlib.gunzipSync;
