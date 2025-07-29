// https://nodejs.org/api/process.html#processhrtime
export const hrtime = /* @__PURE__ */ Object.assign(function hrtime(startTime) {
	const now = Date.now();
	// millis to seconds
	const seconds = Math.trunc(now / 1e3);
	// convert millis to nanos
	const nanos = now % 1e3 * 1e6;
	if (startTime) {
		let diffSeconds = seconds - startTime[0];
		let diffNanos = nanos - startTime[0];
		if (diffNanos < 0) {
			diffSeconds = diffSeconds - 1;
			diffNanos = 1e9 + diffNanos;
		}
		return [diffSeconds, diffNanos];
	}
	return [seconds, nanos];
}, { bigint: function bigint() {
	// Convert milliseconds to nanoseconds
	return BigInt(Date.now() * 1e6);
} });
