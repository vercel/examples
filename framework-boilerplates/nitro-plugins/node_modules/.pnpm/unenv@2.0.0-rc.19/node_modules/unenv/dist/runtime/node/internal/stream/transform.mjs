import { Duplex } from "./duplex.mjs";
// Docs: https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams
// Implementation: https://github.com/nodejs/node/blob/master/lib/internal/streams/transform.js
export class _Transform extends Duplex {
	__unenv__ = true;
	_transform(chunk, encoding, callback) {}
	_flush(callback) {}
}
export const Transform = globalThis.Transform || _Transform;
