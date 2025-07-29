import type nodeStream from "node:stream";
import { Duplex } from "./duplex.mjs";
// Docs: https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams
// Implementation: https://github.com/nodejs/node/blob/master/lib/internal/streams/transform.js
export declare class _Transform extends Duplex implements nodeStream.Transform {
	readonly __unenv__: true;
	_transform(chunk: any, encoding: globalThis.BufferEncoding, callback: nodeStream.TransformCallback): void;
	_flush(callback: nodeStream.TransformCallback): void;
}
export declare const Transform: typeof nodeStream.Transform;
