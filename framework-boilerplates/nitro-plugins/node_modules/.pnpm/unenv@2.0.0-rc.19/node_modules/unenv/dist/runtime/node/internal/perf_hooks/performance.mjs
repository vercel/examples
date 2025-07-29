import { createNotImplementedError } from "../../../_internal/utils.mjs";
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
const nodeTiming = {
	name: "node",
	entryType: "node",
	startTime: 0,
	duration: 0,
	nodeStart: 0,
	v8Start: 0,
	bootstrapComplete: 0,
	environment: 0,
	loopStart: 0,
	loopExit: 0,
	idleTime: 0,
	uvMetricsInfo: {
		loopCount: 0,
		events: 0,
		eventsWaiting: 0
	},
	detail: undefined,
	toJSON() {
		return this;
	}
};
// PerformanceEntry
export class PerformanceEntry {
	__unenv__ = true;
	detail;
	entryType = "event";
	name;
	startTime;
	constructor(name, options) {
		this.name = name;
		this.startTime = options?.startTime || _performanceNow();
		this.detail = options?.detail;
	}
	get duration() {
		return _performanceNow() - this.startTime;
	}
	toJSON() {
		return {
			name: this.name,
			entryType: this.entryType,
			startTime: this.startTime,
			duration: this.duration,
			detail: this.detail
		};
	}
}
// PerformanceMark
export const PerformanceMark = class PerformanceMark extends PerformanceEntry {
	entryType = "mark";
	constructor() {
		// @ts-ignore
		super(...arguments);
	}
	get duration() {
		return 0;
	}
};
// PerformanceMark
export class PerformanceMeasure extends PerformanceEntry {
	entryType = "measure";
}
// PerformanceResourceTiming
export class PerformanceResourceTiming extends PerformanceEntry {
	entryType = "resource";
	serverTiming = [];
	connectEnd = 0;
	connectStart = 0;
	decodedBodySize = 0;
	domainLookupEnd = 0;
	domainLookupStart = 0;
	encodedBodySize = 0;
	fetchStart = 0;
	initiatorType = "";
	name = "";
	nextHopProtocol = "";
	redirectEnd = 0;
	redirectStart = 0;
	requestStart = 0;
	responseEnd = 0;
	responseStart = 0;
	secureConnectionStart = 0;
	startTime = 0;
	transferSize = 0;
	workerStart = 0;
	responseStatus = 0;
}
// PerformanceObserverEntryList
export class PerformanceObserverEntryList {
	__unenv__ = true;
	getEntries() {
		return [];
	}
	getEntriesByName(_name, _type) {
		return [];
	}
	getEntriesByType(type) {
		return [];
	}
}
// Performance
export class Performance {
	__unenv__ = true;
	timeOrigin = _timeOrigin;
	eventCounts = new Map();
	_entries = [];
	_resourceTimingBufferSize = 0;
	navigation = undefined;
	timing = undefined;
	timerify(_fn, _options) {
		throw createNotImplementedError("Performance.timerify");
	}
	get nodeTiming() {
		return nodeTiming;
	}
	eventLoopUtilization() {
		return {};
	}
	markResourceTiming() {
		// TODO: create a new PerformanceResourceTiming entry
		// so that performance.getEntries, getEntriesByName, and getEntriesByType return it
		// see: https://nodejs.org/api/perf_hooks.html#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype
		return new PerformanceResourceTiming("");
	}
	onresourcetimingbufferfull = null;
	now() {
		// https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
		if (this.timeOrigin === _timeOrigin) {
			return _performanceNow();
		}
		return Date.now() - this.timeOrigin;
	}
	clearMarks(markName) {
		this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
	}
	clearMeasures(measureName) {
		this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
	}
	clearResourceTimings() {
		this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
	}
	getEntries() {
		return this._entries;
	}
	getEntriesByName(name, type) {
		return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
	}
	getEntriesByType(type) {
		return this._entries.filter((e) => e.entryType === type);
	}
	mark(name, options) {
		// @ts-expect-error constructor is not protected
		const entry = new PerformanceMark(name, options);
		this._entries.push(entry);
		return entry;
	}
	measure(measureName, startOrMeasureOptions, endMark) {
		let start;
		let end;
		if (typeof startOrMeasureOptions === "string") {
			start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
			end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
		} else {
			start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
			end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
		}
		const entry = new PerformanceMeasure(measureName, {
			startTime: start,
			detail: {
				start,
				end
			}
		});
		this._entries.push(entry);
		return entry;
	}
	setResourceTimingBufferSize(maxSize) {
		this._resourceTimingBufferSize = maxSize;
	}
	addEventListener(type, listener, options) {
		throw createNotImplementedError("Performance.addEventListener");
	}
	removeEventListener(type, listener, options) {
		throw createNotImplementedError("Performance.removeEventListener");
	}
	dispatchEvent(event) {
		throw createNotImplementedError("Performance.dispatchEvent");
	}
	toJSON() {
		return this;
	}
}
// PerformanceObserver
export class PerformanceObserver {
	__unenv__ = true;
	static supportedEntryTypes = [];
	_callback = null;
	constructor(callback) {
		this._callback = callback;
	}
	takeRecords() {
		return [];
	}
	disconnect() {
		throw createNotImplementedError("PerformanceObserver.disconnect");
	}
	observe(options) {
		throw createNotImplementedError("PerformanceObserver.observe");
	}
	bind(fn) {
		return fn;
	}
	runInAsyncScope(fn, thisArg, ...args) {
		return fn.call(thisArg, ...args);
	}
	asyncId() {
		return 0;
	}
	triggerAsyncId() {
		return 0;
	}
	emitDestroy() {
		return this;
	}
}
// workerd implements a subset of globalThis.performance (as of last check, only timeOrigin set to 0 + now() implemented)
// We already use performance.now() from globalThis.performance, if provided (see top of this file)
// If we detect this condition, we can just use polyfill instead.
export const performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
