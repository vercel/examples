import type nodeV8 from "node:v8";
export { Deserializer, DefaultDeserializer } from "./internal/v8/deserializer.mjs";
export { Serializer, DefaultSerializer } from "./internal/v8/serializer.mjs";
export { GCProfiler } from "./internal/v8/profiler.mjs";
export declare const cachedDataVersionTag: typeof nodeV8.cachedDataVersionTag;
export declare const deserialize: typeof nodeV8.deserialize;
export declare const getHeapCodeStatistics: typeof nodeV8.getHeapCodeStatistics;
export declare const getHeapSpaceStatistics: typeof nodeV8.getHeapSpaceStatistics;
export declare const getHeapStatistics: typeof nodeV8.getHeapStatistics;
export declare const getHeapSnapshot: typeof nodeV8.getHeapSnapshot;
export declare const promiseHooks: typeof nodeV8.promiseHooks;
export declare const serialize: typeof nodeV8.serialize;
export declare const setFlagsFromString: typeof nodeV8.setFlagsFromString;
export declare const setHeapSnapshotNearHeapLimit: typeof nodeV8.setHeapSnapshotNearHeapLimit;
export declare const startupSnapshot: typeof nodeV8.startupSnapshot;
export declare const stopCoverage: typeof nodeV8.stopCoverage;
export declare const takeCoverage: typeof nodeV8.takeCoverage;
export declare const writeHeapSnapshot: typeof nodeV8.writeHeapSnapshot;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type _Function = Function;
export declare function queryObjects(ctor: _Function): number | string[];
export declare function queryObjects(ctor: _Function, options: {
	format: "count";
}): number;
export declare function queryObjects(ctor: _Function, options: {
	format: "summary";
}): string[];
declare const _default: {};
export default _default;
