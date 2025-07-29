import noop from "../mock/noop.mjs";
import promises from "node:readline/promises";
import { Interface } from "./internal/readline/interface.mjs";
export { promises };
export { Interface } from "./internal/readline/interface.mjs";
export const clearLine = () => false;
export const clearScreenDown = () => false;
export const createInterface = () => new Interface();
export const cursorTo = () => false;
export const emitKeypressEvents = noop;
export const moveCursor = () => false;
export default {
	clearLine,
	clearScreenDown,
	createInterface,
	cursorTo,
	emitKeypressEvents,
	moveCursor,
	Interface,
	promises
};
