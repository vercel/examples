export { type _PerformanceEntryType, _PerformanceEntry, _PerformanceMark, _PerformanceMeasure, _PerformanceResourceTiming, _Performance, _PerformanceObserver, _PerformanceObserverEntryList } from "./_polyfills.mjs";
export declare const PerformanceEntry: typeof globalThis.PerformanceEntry;
export declare const PerformanceMark: typeof globalThis.PerformanceMark;
export declare const PerformanceMeasure: typeof globalThis.PerformanceMeasure;
export declare const PerformanceResourceTiming: typeof globalThis.PerformanceResourceTiming;
export declare const PerformanceObserver: typeof globalThis.PerformanceObserver;
export declare const Performance: typeof globalThis.Performance;
export declare const PerformanceObserverEntryList: typeof globalThis.PerformanceObserverEntryList;
// workerd implements a subset of globalThis.performance (as of last check, only timeOrigin set to 0 + now() implemented)
// We already use performance.now() from globalThis.performance, if provided (see top of this file)
// If we detect this condition, we can just use polyfill instead.
export declare const performance: unknown;
