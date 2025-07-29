import { setTimeoutFallbackPromises as setTimeout } from "./set-timeout.mjs";
import { setImmediateFallbackPromises as setImmediate } from "./set-immediate.mjs";
export class Scheduler {
	wait(delay, options) {
		return setTimeout(delay, undefined, options);
	}
	yield() {
		return setImmediate();
	}
}
