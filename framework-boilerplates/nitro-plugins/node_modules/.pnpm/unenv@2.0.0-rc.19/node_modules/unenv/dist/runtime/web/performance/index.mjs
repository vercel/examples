// https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
import { _PerformanceEntry, _PerformanceMark, _PerformanceMeasure, _PerformanceResourceTiming, _Performance, _PerformanceObserver, _PerformanceObserverEntryList } from "./_polyfills.mjs";
export { _PerformanceEntry, _PerformanceMark, _PerformanceMeasure, _PerformanceResourceTiming, _Performance, _PerformanceObserver, _PerformanceObserverEntryList } from "./_polyfills.mjs";
export const PerformanceEntry = globalThis.PerformanceEntry || _PerformanceEntry;
export const PerformanceMark = globalThis.PerformanceMark || _PerformanceMark;
export const PerformanceMeasure = globalThis.PerformanceMeasure || _PerformanceMeasure;
export const PerformanceResourceTiming = globalThis.PerformanceResourceTiming || _PerformanceResourceTiming;
export const PerformanceObserver = globalThis.PerformanceObserver || _PerformanceObserver;
export const Performance = globalThis.Performance || _Performance;
export const PerformanceObserverEntryList = globalThis.PerformanceObserverEntryList || _PerformanceObserverEntryList;
// workerd implements a subset of globalThis.performance (as of last check, only timeOrigin set to 0 + now() implemented)
// We already use performance.now() from globalThis.performance, if provided (see top of this file)
// If we detect this condition, we can just use polyfill instead.
export const performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new _Performance();
