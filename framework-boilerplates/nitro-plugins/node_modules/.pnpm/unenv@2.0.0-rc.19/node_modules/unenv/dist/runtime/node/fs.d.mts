import promises from "node:fs/promises";
import * as constants from "./internal/fs/constants.mjs";
export { F_OK, R_OK, W_OK, X_OK } from "./internal/fs/constants.mjs";
export { promises, constants };
export * from "./internal/fs/fs.mjs";
export * from "./internal/fs/classes.mjs";
declare const _default: {
	constants: any;
};
export default _default;
