import { Tracing } from "./internal/trace_events/tracing.mjs";
export const createTracing = function() {
	return new Tracing();
};
export const getEnabledCategories = () => "";
export default {
	createTracing,
	getEnabledCategories
};
