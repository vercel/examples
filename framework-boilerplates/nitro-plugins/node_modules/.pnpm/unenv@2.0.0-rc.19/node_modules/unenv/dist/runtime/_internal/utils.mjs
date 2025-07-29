/* @__NO_SIDE_EFFECTS__ */
export function rawHeaders(headers) {
	const rawHeaders = [];
	for (const key in headers) {
		if (Array.isArray(headers[key])) {
			for (const h of headers[key]) {
				rawHeaders.push(key, h);
			}
		} else {
			rawHeaders.push(key, headers[key]);
		}
	}
	return rawHeaders;
}
/* @__NO_SIDE_EFFECTS__ */
export function mergeFns(...functions) {
	return function(...args) {
		for (const fn of functions) {
			fn(...args);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
export function createNotImplementedError(name) {
	return new Error(`[unenv] ${name} is not implemented yet!`);
}
/* @__NO_SIDE_EFFECTS__ */
export function notImplemented(name) {
	const fn = () => {
		throw createNotImplementedError(name);
	};
	return Object.assign(fn, { __unenv__: true });
}
/* @__NO_SIDE_EFFECTS__ */
export function notImplementedAsync(name) {
	const fn = notImplemented(name);
	fn.__promisify__ = () => notImplemented(name + ".__promisify__");
	fn.native = fn;
	return fn;
}
/* @__NO_SIDE_EFFECTS__ */
export function notImplementedClass(name) {
	return class {
		__unenv__ = true;
		constructor() {
			throw new Error(`[unenv] ${name} is not implemented yet!`);
		}
	};
}
