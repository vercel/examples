// https://nodejs.org/api/async_context.html#class-asynclocalstorage
class _AsyncLocalStorage {
	__unenv__ = true;
	_currentStore;
	_enterStore;
	_enabled = true;
	getStore() {
		return this._currentStore ?? this._enterStore;
	}
	disable() {
		this._enabled = false;
	}
	enable() {
		this._enabled = true;
	}
	enterWith(store) {
		this._enterStore = store;
	}
	run(store, callback, ...args) {
		this._currentStore = store;
		const res = callback(...args);
		this._currentStore = undefined;
		return res;
	}
	exit(callback, ...args) {
		const _previousStore = this._currentStore;
		this._currentStore = undefined;
		const res = callback(...args);
		this._currentStore = _previousStore;
		return res;
	}
	static snapshot() {
		throw new Error("[unenv] `AsyncLocalStorage.snapshot` is not implemented!");
	}
}
export const AsyncLocalStorage = globalThis.AsyncLocalStorage || _AsyncLocalStorage;
