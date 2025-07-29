import noop from "../mock/noop.mjs";
import { Readable } from "node:stream";
import { Deserializer, DefaultDeserializer } from "./internal/v8/deserializer.mjs";
import { Serializer, DefaultSerializer } from "./internal/v8/serializer.mjs";
import { GCProfiler } from "./internal/v8/profiler.mjs";
export { Deserializer, DefaultDeserializer } from "./internal/v8/deserializer.mjs";
export { Serializer, DefaultSerializer } from "./internal/v8/serializer.mjs";
export { GCProfiler } from "./internal/v8/profiler.mjs";
const getMockHeapSpaceStats = (name) => ({
	space_name: name,
	space_size: 0,
	space_used_size: 0,
	space_available_size: 0,
	physical_space_size: 0
});
export const cachedDataVersionTag = () => 0;
export const deserialize = noop;
export const getHeapCodeStatistics = () => ({
	code_and_metadata_size: 0,
	bytecode_and_metadata_size: 0,
	external_script_source_size: 0,
	cpu_profiler_metadata_size: 0
});
export const getHeapSpaceStatistics = () => [
	"read_only_space",
	"new_space",
	"old_space",
	"code_space",
	"map_space",
	"large_object_space",
	"code_large_object_space",
	"new_large_object_space"
].map((space) => getMockHeapSpaceStats(space));
export const getHeapStatistics = () => ({
	total_heap_size: 0,
	total_heap_size_executable: 0,
	total_physical_size: 0,
	total_available_size: 0,
	used_heap_size: 0,
	heap_size_limit: 0,
	malloced_memory: 0,
	peak_malloced_memory: 0,
	does_zap_garbage: 0,
	number_of_native_contexts: 0,
	number_of_detached_contexts: 0,
	total_global_handles_size: 0,
	used_global_handles_size: 0,
	external_memory: 0
});
export const getHeapSnapshot = () => {
	return Readable.from(`{
    snapshot: {},
    nodes: [],
    edges: [],
    trace_function_infos: [],
    trace_tree: [],
    samples: [],
    locations: [],
    strings: [],
  }`);
};
export const promiseHooks = {
	onInit: () => noop,
	onSettled: () => noop,
	onBefore: () => noop,
	onAfter: () => noop,
	createHook: () => noop
};
export const serialize = (value) => Buffer.from(value);
export const setFlagsFromString = noop;
export const setHeapSnapshotNearHeapLimit = noop;
export const startupSnapshot = {
	addDeserializeCallback: noop,
	addSerializeCallback: noop,
	setDeserializeMainFunction: noop,
	isBuildingSnapshot: () => false
};
export const stopCoverage = noop;
export const takeCoverage = noop;
export const writeHeapSnapshot = () => "";
export function queryObjects(_ctor, options) {
	if (options?.format === "count") {
		return 0;
	}
	return [];
}
export default {
	DefaultDeserializer,
	Deserializer,
	GCProfiler,
	DefaultSerializer,
	Serializer,
	cachedDataVersionTag,
	deserialize,
	getHeapCodeStatistics,
	getHeapSnapshot,
	getHeapSpaceStatistics,
	getHeapStatistics,
	promiseHooks,
	serialize,
	setFlagsFromString,
	setHeapSnapshotNearHeapLimit,
	startupSnapshot,
	stopCoverage,
	takeCoverage,
	writeHeapSnapshot,
	queryObjects
};
