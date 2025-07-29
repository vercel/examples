import { mergeFns } from "../../../_internal/utils.mjs";
import { Readable } from "./readable.mjs";
import { Writable } from "./writable.mjs";
const __Duplex = class {
	allowHalfOpen = true;
	_destroy;
	constructor(readable = new Readable(), writable = new Writable()) {
		Object.assign(this, readable);
		Object.assign(this, writable);
		this._destroy = mergeFns(readable._destroy, writable._destroy);
	}
};
function getDuplex() {
	Object.assign(__Duplex.prototype, Readable.prototype);
	Object.assign(__Duplex.prototype, Writable.prototype);
	return __Duplex;
}
export const _Duplex = /* @__PURE__ */ getDuplex();
export const Duplex = globalThis.Duplex || _Duplex;
