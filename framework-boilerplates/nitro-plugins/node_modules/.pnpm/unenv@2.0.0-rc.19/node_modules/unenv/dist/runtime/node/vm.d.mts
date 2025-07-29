import type nodeVm from "node:vm";
export { Script } from "./internal/vm/script.mjs";
export * as constants from "./internal/vm/constants.mjs";
export declare const compileFunction: typeof nodeVm.compileFunction;
export declare const createContext: typeof nodeVm.createContext;
export declare const createScript: unknown;
export declare const isContext: typeof nodeVm.isContext;
export declare const measureMemory: typeof nodeVm.measureMemory;
export declare const runInContext: typeof nodeVm.runInContext;
export declare const runInNewContext: typeof nodeVm.runInNewContext;
export declare const runInThisContext: typeof nodeVm.runInThisContext;
declare const _default: {
	constants: typeof nodeVm.constants;
};
export default _default;
