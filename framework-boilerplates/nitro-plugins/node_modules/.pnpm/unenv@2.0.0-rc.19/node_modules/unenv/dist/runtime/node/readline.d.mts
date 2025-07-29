// https://nodejs.org/api/readline.html#readlineclearlinestream-dir-callback
import type nodeReadline from "node:readline";
import promises from "node:readline/promises";
export { promises };
export { Interface } from "./internal/readline/interface.mjs";
export declare const clearLine: typeof nodeReadline.clearLine;
export declare const clearScreenDown: typeof nodeReadline.clearScreenDown;
export declare const createInterface: typeof nodeReadline.createInterface;
export declare const cursorTo: typeof nodeReadline.cursorTo;
export declare const emitKeypressEvents: typeof nodeReadline.emitKeypressEvents;
export declare const moveCursor: typeof nodeReadline.moveCursor;
declare const _default: {};
export default _default;
