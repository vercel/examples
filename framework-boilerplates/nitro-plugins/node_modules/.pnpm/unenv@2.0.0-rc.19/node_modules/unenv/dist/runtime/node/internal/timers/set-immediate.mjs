import { Immediate } from "./immediate.mjs";
export function setImmediateFallbackPromises(value) {
	return new Promise((res) => {
		res(value);
	});
}
export function setImmediateFallback(callback, ...args) {
	return new Immediate(callback, args);
}
setImmediateFallback.__promisify__ = setImmediateFallbackPromises;
export function clearImmediateFallback(immediate) {
	immediate?.[Symbol.dispose]();
}
