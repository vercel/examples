import { Timeout } from "./timeout.mjs";
export function setTimeoutFallbackPromises(delay, value, options) {
	return new Promise((res) => {
		// NOTE: we are ignoring options?.signal? as promise is immediately resolved
		res(value);
	});
}
export function setTimeoutFallback(callback, ms, ...args) {
	return new Timeout(callback, args);
}
setTimeoutFallback.__promisify__ = setTimeoutFallbackPromises;
