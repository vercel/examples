import type nodeTraceEvents from "node:trace_events";
export declare class Tracing implements nodeTraceEvents.Tracing {
	categories: string;
	enabled: boolean;
	disable();
	enable();
}
