// https://nodejs.org/api/inspector.html
import { notImplementedClass, notImplemented } from "../_internal/utils.mjs";
import noop from "../mock/noop.mjs";
export const close = noop;
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
export const open = () => ({
	__unenv__: true,
	[Symbol.dispose]() {
		return Promise.resolve();
	}
});
export const url = () => undefined;
export const waitForDebugger = noop;
// `node:inspector` and `node:inspector/promises` share the same implementation with only Session being in the promises module:
// https://github.com/nodejs/node/blob/main/lib/inspector/promises.js
export const Session = /* @__PURE__ */ notImplementedClass("inspector.Session");
export const Network = {
	loadingFailed: /* @__PURE__ */ notImplemented("inspector.Network.loadingFailed"),
	loadingFinished: /* @__PURE__ */ notImplemented("inspector.Network.loadingFinished"),
	requestWillBeSent: /* @__PURE__ */ notImplemented("inspector.Network.requestWillBeSent"),
	responseReceived: /* @__PURE__ */ notImplemented("inspector.Network.responseReceived")
};
export default {
	Session,
	close,
	console,
	open,
	url,
	waitForDebugger,
	Network
};
