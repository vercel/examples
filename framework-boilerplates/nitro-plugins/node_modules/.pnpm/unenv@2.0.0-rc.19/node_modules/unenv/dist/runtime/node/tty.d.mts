import type nodeTty from "node:tty";
export { ReadStream } from "./internal/tty/read-stream.mjs";
export { WriteStream } from "./internal/tty/write-stream.mjs";
export declare const isatty: typeof nodeTty.isatty;
declare const _default: {
	ReadStream: typeof nodeTty.ReadStream;
	WriteStream: typeof nodeTty.WriteStream;
};
export default _default;
