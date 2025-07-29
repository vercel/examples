import { Interface } from "../internal/readline/promises/interface.mjs";
import { Readline } from "../internal/readline/promises/readline.mjs";
export { Interface } from "../internal/readline/promises/interface.mjs";
export { Readline } from "../internal/readline/promises/readline.mjs";
export const createInterface = () => new Interface();
export default {
	Interface,
	Readline,
	createInterface
};
