import { createNotImplementedError } from "../../../_internal/utils.mjs";
class Histogram {
	min = 0x8000000000000000;
	max = 0;
	mean = Number.NaN;
	exceeds = 0;
	stddev = Number.NaN;
	count = 0;
	countBigInt = BigInt(0);
	exceedsBigInt = BigInt(0);
	maxBigInt = 0;
	minBigInt = BigInt(9223372036854775807n);
	percentiles = new Map();
	percentilesBigInt = new Map();
	percentileBigInt(_percentile) {
		throw createNotImplementedError("Histogram.percentileBigInt");
	}
	percentile(percentile) {
		return this.percentiles.get(percentile) ?? Number.NaN;
	}
	reset() {
		throw createNotImplementedError("Histogram.reset");
	}
}
export class IntervalHistogram extends Histogram {
	enable() {
		return true;
	}
	disable() {
		return true;
	}
}
export class RecordableHistogram extends Histogram {
	record(val) {
		throw createNotImplementedError("RecordableHistogram.record");
	}
	recordDelta() {
		throw createNotImplementedError("RecordableHistogram.recordDelta");
	}
	add(other) {
		throw createNotImplementedError("RecordableHistogram.add");
	}
}
