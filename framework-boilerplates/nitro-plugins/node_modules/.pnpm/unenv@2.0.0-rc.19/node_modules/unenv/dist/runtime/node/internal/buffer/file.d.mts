import type nodeBuffer from "node:buffer";
export declare class File extends Blob implements nodeBuffer.File {
	readonly __unenv__: true;
	size: number;
	type: any;
	name: string;
	lastModified: number;
	constructor(...args: any[]);
	arrayBuffer(): Promise<ArrayBuffer>;
	slice(): any;
	text(): any;
	stream(): any;
	bytes(): Promise<Uint8Array>;
}
