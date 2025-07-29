import type nodePerfHooks from "node:perf_hooks";
export * from "./internal/perf_hooks/performance.mjs";
// prettier-ignore
export declare const constants: typeof nodePerfHooks.constants;
export declare const monitorEventLoopDelay: typeof nodePerfHooks.monitorEventLoopDelay;
export declare const createHistogram: typeof nodePerfHooks.createHistogram;
declare const _default: {};
export default _default;
