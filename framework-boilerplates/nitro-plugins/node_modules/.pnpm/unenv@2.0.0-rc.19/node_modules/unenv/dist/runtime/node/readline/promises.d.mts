import type nodeReadline from "node:readline/promises";
export { Interface } from "../internal/readline/promises/interface.mjs";
export { Readline } from "../internal/readline/promises/readline.mjs";
export declare const createInterface: typeof nodeReadline.createInterface;
declare const _default: typeof nodeReadline;
export default _default;
