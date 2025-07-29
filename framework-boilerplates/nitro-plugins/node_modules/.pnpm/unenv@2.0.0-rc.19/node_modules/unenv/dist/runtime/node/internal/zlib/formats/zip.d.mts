import type nodeZlib from "node:zlib";
import { ZlibCompress } from "./_shared.mjs";
// Zip Decompression
export declare class Unzip extends ZlibCompress {
	readonly _format = "zip";
}
export declare const createUnzip: typeof nodeZlib.createUnzip;
export declare const unzip: typeof nodeZlib.unzip;
export declare const unzipSync: typeof nodeZlib.unzipSync;
