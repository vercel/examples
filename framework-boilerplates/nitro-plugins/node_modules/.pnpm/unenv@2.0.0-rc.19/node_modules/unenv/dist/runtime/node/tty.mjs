import { WriteStream } from "./internal/tty/write-stream.mjs";
export { ReadStream } from "./internal/tty/read-stream.mjs";
export { WriteStream } from "./internal/tty/write-stream.mjs";
export const isatty = function() {
	return false;
};
export default {
	ReadStream: WriteStream,
	WriteStream,
	isatty
};
