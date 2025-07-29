export class GCProfiler {
	start() {}
	stop() {
		return {
			version: 1,
			startTime: 0,
			endTime: 0,
			statistics: []
		};
	}
}
