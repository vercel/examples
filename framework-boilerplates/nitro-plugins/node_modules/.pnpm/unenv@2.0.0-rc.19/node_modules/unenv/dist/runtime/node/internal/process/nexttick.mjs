// https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask
// https://nodejs.org/api/process.html#when-to-use-queuemicrotask-vs-processnexttick
export const nextTick = globalThis.queueMicrotask ? (cb, ...args) => {
	globalThis.queueMicrotask(cb.bind(undefined, ...args));
} : /* @__PURE__ */ createNextTickWithTimeout();
// Fallback for runtimes not implementing queueMicrotask
function createNextTickWithTimeout() {
	let queue = [];
	let draining = false;
	let currentQueue;
	let queueIndex = -1;
	function cleanUpNextTick() {
		if (!draining || !currentQueue) {
			return;
		}
		draining = false;
		if (currentQueue.length > 0) {
			queue = [...currentQueue, ...queue];
		} else {
			queueIndex = -1;
		}
		if (queue.length > 0) {
			drainQueue();
		}
	}
	function drainQueue() {
		if (draining) {
			return;
		}
		const timeout = setTimeout(cleanUpNextTick);
		draining = true;
		let len = queue.length;
		while (len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) {
				if (currentQueue) {
					currentQueue[queueIndex]();
				}
			}
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = undefined;
		draining = false;
		clearTimeout(timeout);
	}
	const nextTick = (cb, ...args) => {
		queue.push(cb.bind(undefined, ...args));
		if (queue.length === 1 && !draining) {
			setTimeout(drainQueue);
		}
	};
	return nextTick;
}
