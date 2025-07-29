const _envShim = Object.create(null);
// Keep a reference to the original process to avoid circular references after polyfilling
const originalProcess = globalThis["process"];
const _getEnv = (useShim) => globalThis.__env__ || originalProcess?.env || (useShim ? _envShim : globalThis);
export const env = /* @__PURE__ */ new Proxy(_envShim, {
	get(_, prop) {
		const env = _getEnv();
		return env[prop] ?? _envShim[prop];
	},
	has(_, prop) {
		const env = _getEnv();
		return prop in env || prop in _envShim;
	},
	set(_, prop, value) {
		const env = _getEnv(true);
		env[prop] = value;
		return true;
	},
	deleteProperty(_, prop) {
		const env = _getEnv(true);
		delete env[prop];
		return true;
	},
	ownKeys() {
		const env = _getEnv();
		return Object.keys(env);
	},
	getOwnPropertyDescriptor(_, prop) {
		const env = _getEnv();
		if (prop in env) {
			return {
				value: env[prop],
				writable: true,
				enumerable: true,
				configurable: true
			};
		}
		return undefined;
	}
});
