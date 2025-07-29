import { createNotImplementedError } from "../../_internal/utils.mjs";
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
// --------------------------------------
// Performance entry polyfills
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/supportedEntryTypes_static
export const _supportedEntryTypes = [
	"event",
	"mark",
	"measure",
	"resource"
];
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry
export class _PerformanceEntry {
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
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark
export class _PerformanceMark extends _PerformanceEntry {
	entryType = "mark";
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMeasure
export class _PerformanceMeasure extends _PerformanceEntry {
	entryType = "measure";
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
export class _PerformanceResourceTiming extends _PerformanceEntry {
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
// --------------------------------------
// PerformanceObserver polyfill
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
export class _PerformanceObserver {
	__unenv__ = true;
	static supportedEntryTypes = _supportedEntryTypes;
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
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserverEntryList
export class _PerformanceObserverEntryList {
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
// --------------------------------------
// Performance polyfill
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/Performance
export class _Performance {
	__unenv__ = true;
	timeOrigin = _timeOrigin;
	eventCounts = new Map();
	_entries = [];
	_resourceTimingBufferSize = 0;
	navigation = undefined;
	timing = undefined;
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
		const entry = new _PerformanceMark(name, options);
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
		const entry = new _PerformanceMeasure(measureName, {
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
	toJSON() {
		return this;
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
}
