import type nodeV8 from "node:v8";
export declare class GCProfiler implements nodeV8.GCProfiler {
	start();
	stop(): {
		version: number;
		startTime: number;
		endTime: number;
		statistics: unknown;
	};
}
