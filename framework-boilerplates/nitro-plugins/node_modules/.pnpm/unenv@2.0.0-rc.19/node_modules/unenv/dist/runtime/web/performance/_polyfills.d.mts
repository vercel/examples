export type _PerformanceEntryType = "mark" | "measure" | "resource" | "event";
// --------------------------------------
// Performance entry polyfills
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/supportedEntryTypes_static
export declare const _supportedEntryTypes: _PerformanceEntryType[];
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry
export declare class _PerformanceEntry implements globalThis.PerformanceEntry {
	readonly __unenv__: true;
	detail: any | undefined;
	entryType: _PerformanceEntryType;
	name: string;
	startTime: number;
	constructor(name: string, options?: PerformanceMarkOptions);
	get duration(): number;
	toJSON(): {};
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark
export declare class _PerformanceMark extends _PerformanceEntry implements globalThis.PerformanceMark {
	entryType: "mark";
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMeasure
export declare class _PerformanceMeasure extends _PerformanceEntry implements globalThis.PerformanceMeasure {
	entryType: "measure";
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
export declare class _PerformanceResourceTiming extends _PerformanceEntry implements globalThis.PerformanceResourceTiming {
	entryType: "resource";
	serverTiming: readonly PerformanceServerTiming[];
	connectEnd: number;
	connectStart: number;
	decodedBodySize: number;
	domainLookupEnd: number;
	domainLookupStart: number;
	encodedBodySize: number;
	fetchStart: number;
	initiatorType: string;
	name: string;
	nextHopProtocol: string;
	redirectEnd: number;
	redirectStart: number;
	requestStart: number;
	responseEnd: number;
	responseStart: number;
	secureConnectionStart: number;
	startTime: number;
	transferSize: number;
	workerStart: number;
	responseStatus: number;
}
// --------------------------------------
// PerformanceObserver polyfill
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
export declare class _PerformanceObserver implements globalThis.PerformanceObserver {
	readonly __unenv__: true;
	static supportedEntryTypes: ReadonlyArray<string>;
	_callback: PerformanceObserverCallback | null;
	constructor(callback: PerformanceObserverCallback);
	takeRecords(): unknown;
	disconnect(): void;
	observe(options: PerformanceObserverInit): void;
}
// https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserverEntryList
export declare class _PerformanceObserverEntryList implements globalThis.PerformanceObserverEntryList {
	readonly __unenv__: true;
	getEntries(): PerformanceEntryList;
	getEntriesByName(_name: string, _type?: string | undefined): PerformanceEntryList;
	getEntriesByType(type: string): PerformanceEntryList;
}
// --------------------------------------
// Performance polyfill
// --------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/Performance
export declare class _Performance<PerformanceEntryT extends PerformanceEntry = PerformanceEntry> implements globalThis.Performance {
	readonly __unenv__: true;
	timeOrigin: number;
	eventCounts: EventCounts;
	_entries: PerformanceEntry[];
	_resourceTimingBufferSize: number;
	navigation: any;
	timing: any;
	onresourcetimingbufferfull: ((this: Performance, ev: Event) => any) | null;
	now(): number;
	clearMarks(markName?: string | undefined): void;
	clearMeasures(measureName?: string | undefined): void;
	clearResourceTimings(): void;
	getEntries(): PerformanceEntryT[];
	getEntriesByName(name: string, type?: string | undefined): PerformanceEntryT[];
	getEntriesByType(type: string): PerformanceEntryT[];
	mark(name: string, options?: PerformanceMarkOptions | undefined): PerformanceMark;
	measure(measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions, endMark?: string): PerformanceMeasure;
	setResourceTimingBufferSize(maxSize: number): void;
	toJSON();
	addEventListener<K extends "resourcetimingbufferfull">(type: K, listener: (this: Performance, ev: PerformanceEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
	removeEventListener<K extends "resourcetimingbufferfull">(type: K, listener: (this: Performance, ev: PerformanceEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
	dispatchEvent(event: Event): boolean;
}
