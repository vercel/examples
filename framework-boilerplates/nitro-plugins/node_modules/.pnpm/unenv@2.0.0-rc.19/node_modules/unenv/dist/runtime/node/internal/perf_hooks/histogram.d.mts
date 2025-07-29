import type nodePerfHooks from "node:perf_hooks";
declare class Histogram implements nodePerfHooks.Histogram {
	min: number;
	max: number;
	mean;
	exceeds: number;
	stddev;
	count: number;
	countBigInt: bigint;
	exceedsBigInt: bigint;
	maxBigInt: number;
	minBigInt: bigint;
	percentiles: Map<number, number>;
	percentilesBigInt: Map<bigint, bigint>;
	percentileBigInt(_percentile: number): bigint;
	percentile(percentile: number): number;
	reset(): void;
}
export declare class IntervalHistogram extends Histogram implements nodePerfHooks.IntervalHistogram {
	enable(): boolean;
	disable(): boolean;
}
export declare class RecordableHistogram extends Histogram implements nodePerfHooks.RecordableHistogram {
	record(val: number | bigint): void;
	recordDelta(): void;
	add(other: nodePerfHooks.RecordableHistogram): void;
}
export {};
