import { Scheduler } from "../internal/timers/scheduler.mjs";
import { setTimeoutFallbackPromises } from "../internal/timers/set-timeout.mjs";
import { setIntervalFallbackPromises } from "../internal/timers/set-interval.mjs";
import { setImmediateFallbackPromises } from "../internal/timers/set-immediate.mjs";
export { setTimeoutFallbackPromises as setTimeout } from "../internal/timers/set-timeout.mjs";
export { setIntervalFallbackPromises as setInterval } from "../internal/timers/set-interval.mjs";
export { setImmediateFallbackPromises as setImmediate } from "../internal/timers/set-immediate.mjs";
export const scheduler = new Scheduler();
export default {
	scheduler,
	setImmediate: setImmediateFallbackPromises,
	setInterval: setIntervalFallbackPromises,
	setTimeout: setTimeoutFallbackPromises
};
