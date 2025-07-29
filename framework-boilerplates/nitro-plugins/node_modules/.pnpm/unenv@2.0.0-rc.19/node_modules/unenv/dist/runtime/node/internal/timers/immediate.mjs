export class Immediate {
	_onImmediate;
	_timeout;
	constructor(callback, args) {
		this._onImmediate = callback;
		if ("setTimeout" in globalThis) {
			this._timeout = setTimeout(callback, 0, ...args);
		} else {
			callback(...args);
		}
	}
	ref() {
		this._timeout?.ref();
		return this;
	}
	unref() {
		this._timeout?.unref();
		return this;
	}
	hasRef() {
		return this._timeout?.hasRef() ?? false;
	}
	[Symbol.dispose]() {
		if ("clearTimeout" in globalThis) {
			clearTimeout(this._timeout);
		}
	}
}
