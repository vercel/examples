import { Timeout } from "./timeout.mjs";
export async function* setIntervalFallbackPromises(delay, value) {
	yield value;
}
export function setIntervalFallback(callback, ms, ...args) {
	return new Timeout(callback, args);
}
setIntervalFallback.__promisify__ = setIntervalFallbackPromises;
