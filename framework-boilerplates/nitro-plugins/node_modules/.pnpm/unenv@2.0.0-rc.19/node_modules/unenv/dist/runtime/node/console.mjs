import { Writable } from "node:stream";
import noop from "../mock/noop.mjs";
import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
const _console = globalThis.console;
// undocumented public APIs
export const _ignoreErrors = true;
export const _stderr = new Writable();
export const _stdout = new Writable();
export const log = _console?.log ?? noop;
export const info = _console?.info ?? log;
export const trace = _console?.trace ?? info;
export const debug = _console?.debug ?? log;
export const table = _console?.table ?? log;
export const error = _console?.error ?? log;
export const warn = _console?.warn ?? error;
// https://developer.chrome.com/docs/devtools/console/api#createtask
export const createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
export const assert = /* @__PURE__ */ notImplemented("console.assert");
// noop
export const clear = _console?.clear ?? noop;
export const count = _console?.count ?? noop;
export const countReset = _console?.countReset ?? noop;
export const dir = _console?.dir ?? noop;
export const dirxml = _console?.dirxml ?? noop;
export const group = _console?.group ?? noop;
export const groupEnd = _console?.groupEnd ?? noop;
export const groupCollapsed = _console?.groupCollapsed ?? noop;
export const profile = _console?.profile ?? noop;
export const profileEnd = _console?.profileEnd ?? noop;
export const time = _console?.time ?? noop;
export const timeEnd = _console?.timeEnd ?? noop;
export const timeLog = _console?.timeLog ?? noop;
export const timeStamp = _console?.timeStamp ?? noop;
export const Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
export const _times = /* @__PURE__ */ new Map();
export function context() {
	// TODO: Should be Console with all the methods
	return _console;
}
export const _stdoutErrorHandler = noop;
export const _stderrErrorHandler = noop;
export default {
	_times,
	_ignoreErrors,
	_stdoutErrorHandler,
	_stderrErrorHandler,
	_stdout,
	_stderr,
	assert,
	clear,
	Console,
	count,
	countReset,
	debug,
	dir,
	dirxml,
	error,
	context,
	createTask,
	group,
	groupEnd,
	groupCollapsed,
	info,
	log,
	profile,
	profileEnd,
	table,
	time,
	timeEnd,
	timeLog,
	timeStamp,
	trace,
	warn
};
