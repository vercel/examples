import { notImplemented } from "../_internal/utils.mjs";
import { Script } from "./internal/vm/script.mjs";
import * as constants from "./internal/vm/constants.mjs";
export { Script } from "./internal/vm/script.mjs";
export * as constants from "./internal/vm/constants.mjs";
export const compileFunction = /* @__PURE__ */ notImplemented("vm.compileFunction");
const _contextSymbol = /* @__PURE__ */ Symbol("uenv.vm.context");
export const createContext = function createContext() {
	return Object.create(null, { [_contextSymbol]: { value: true } });
};
export const createScript = function createScript() {
	return new Script();
};
export const isContext = (context) => {
	return context && context[_contextSymbol] === true;
};
export const measureMemory = () => Promise.resolve({
	total: {
		jsMemoryEstimate: 0,
		jsMemoryRange: [1, 2]
	},
	WebAssembly: {
		code: 0,
		metadata: 0
	}
});
export const runInContext = /* @__PURE__ */ notImplemented("vm.runInContext");
export const runInNewContext = /* @__PURE__ */ notImplemented("vm.runInNewContext");
export const runInThisContext = /* @__PURE__ */ notImplemented("vm.runInThisContext");
export default {
	Script,
	compileFunction,
	constants,
	createContext,
	isContext,
	measureMemory,
	runInContext,
	runInNewContext,
	runInThisContext,
	createScript
};
