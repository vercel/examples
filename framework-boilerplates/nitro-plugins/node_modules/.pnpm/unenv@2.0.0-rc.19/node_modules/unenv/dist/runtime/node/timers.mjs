import { notImplemented } from "../_internal/utils.mjs";
import noop from "../mock/noop.mjs";
import promises from "node:timers/promises";
import { setTimeoutFallback } from "./internal/timers/set-timeout.mjs";
import { setImmediateFallback, clearImmediateFallback } from "./internal/timers/set-immediate.mjs";
import { setIntervalFallback } from "./internal/timers/set-interval.mjs";
export { promises };
export const clearImmediate = globalThis.clearImmediate?.bind(globalThis) || clearImmediateFallback;
export const clearInterval = globalThis.clearInterval?.bind(globalThis) || noop;
export const clearTimeout = globalThis.clearTimeout?.bind(globalThis) || noop;
export const setImmediate = globalThis.setImmediate?.bind(globalThis) || setImmediateFallback;
export const setTimeout = globalThis.setTimeout?.bind(globalThis) || setTimeoutFallback;
export const setInterval = globalThis.setInterval?.bind(globalThis) || setIntervalFallback;
export const active = function active(timeout) {
	timeout?.refresh?.();
};
export const _unrefActive = active;
export const enroll = /* @__PURE__ */ notImplemented("timers.enroll");
export const unenroll = /* @__PURE__ */ notImplemented("timers.unenroll");
export default {
	_unrefActive,
	active,
	clearImmediate,
	clearInterval,
	clearTimeout,
	enroll,
	promises,
	setImmediate,
	setInterval,
	setTimeout,
	unenroll
};
