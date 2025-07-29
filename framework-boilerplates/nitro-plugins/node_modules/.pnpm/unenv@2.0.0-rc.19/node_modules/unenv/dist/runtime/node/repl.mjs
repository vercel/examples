import { builtinModules as _builtinModules } from "node:module";
import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
export const writer = /* @__PURE__ */ notImplementedClass("repl.writer");
export const start = /* @__PURE__ */ notImplemented("repl.start");
export const Recoverable = /* @__PURE__ */ notImplementedClass("repl.Recoverable");
export const REPLServer = /* @__PURE__ */ notImplementedClass("repl.REPLServer");
export const REPL_MODE_SLOPPY = /* @__PURE__ */ Symbol("repl-sloppy");
export const REPL_MODE_STRICT = /* @__PURE__ */ Symbol("repl-strict");
export const builtinModules = /* @__PURE__ */ _builtinModules.filter((m) => m[0] !== "_");
export const _builtinLibs = builtinModules;
export default {
	writer,
	start,
	Recoverable,
	REPLServer,
	builtinModules,
	_builtinLibs,
	REPL_MODE_SLOPPY,
	REPL_MODE_STRICT
};
