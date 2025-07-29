import { createNotImplementedError } from "../../../_internal/utils.mjs";
export class Timeout {
	constructor(callback, args) {
		if (typeof callback === "function") {
			callback(...args);
		}
	}
	close() {
		throw createNotImplementedError("node.timers.timeout.close");
	}
	_onTimeout(...args) {
		throw createNotImplementedError("node.timers.timeout._onTimeout");
	}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
	hasRef() {
		return false;
	}
	refresh() {
		return this;
	}
	[Symbol.dispose]() {}
	[Symbol.toPrimitive]() {
		return 0;
	}
}
