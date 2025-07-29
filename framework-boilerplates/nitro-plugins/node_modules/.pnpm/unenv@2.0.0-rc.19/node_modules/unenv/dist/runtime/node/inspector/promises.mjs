import { notImplemented, notImplementedClass } from "../../_internal/utils.mjs";
import noop from "../../mock/noop.mjs";
export const console = {
	debug: noop,
	error: noop,
	info: noop,
	log: noop,
	warn: noop,
	dir: noop,
	dirxml: noop,
	table: noop,
	trace: noop,
	group: noop,
	groupCollapsed: noop,
	groupEnd: noop,
	clear: noop,
	count: noop,
	countReset: noop,
	assert: noop,
	profile: noop,
	profileEnd: noop,
	time: noop,
	timeLog: noop,
	timeStamp: noop
};
export const Network = /* @__PURE__ */ notImplementedClass("inspectorPromises.Network");
export const Session = /* @__PURE__ */ notImplementedClass("inspectorPromises.Session");
export const url = /* @__PURE__ */ notImplemented("inspectorPromises.url");
export const waitForDebugger = /* @__PURE__ */ notImplemented("inspectorPromises.waitForDebugger");
export const open = /* @__PURE__ */ notImplemented("inspectorPromises.open");
export const close = /* @__PURE__ */ notImplemented("inspectorPromises.close");
export default {
	close,
	console,
	Network,
	open,
	Session,
	url,
	waitForDebugger
};
