// https://github.com/sindresorhus/is/tree/main?tab=readme-ov-file#why-not-just-use-instanceof-instead-of-this-package
const isSet = input => Object.prototype.toString.call(input) === '[object Set]';

export function includeKeys(object, predicate) {
	const result = {};

	if (Array.isArray(predicate) || isSet(predicate)) {
		for (const key of predicate) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);

			if (!descriptor?.enumerable) {
				continue;
			}

			Object.defineProperty(result, key, descriptor);
		}
	} else {
		// `Reflect.ownKeys()` is required to retrieve symbol properties
		for (const key of Reflect.ownKeys(object)) {
			const descriptor = Object.getOwnPropertyDescriptor(object, key);

			if (!descriptor?.enumerable) {
				continue;
			}

			const value = object[key];
			if (predicate(key, value, object)) {
				Object.defineProperty(result, key, descriptor);
			}
		}
	}

	return result;
}

export function excludeKeys(object, predicate) {
	if (Array.isArray(predicate)) {
		const set = new Set(predicate);
		return includeKeys(object, key => !set.has(key));
	}

	if (isSet(predicate)) {
		return includeKeys(object, key => !predicate.has(key));
	}

	return includeKeys(object, (key, value, object) => !predicate(key, value, object));
}
