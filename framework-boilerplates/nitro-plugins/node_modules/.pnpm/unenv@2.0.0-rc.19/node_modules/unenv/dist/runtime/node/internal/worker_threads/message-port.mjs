import { EventEmitter } from "node:events";
export class MessagePort extends EventEmitter {
	close() {}
	postMessage(value, transferList) {}
	ref() {}
	unref() {}
	start() {}
	addEventListener(type, listener) {
		this.on(type, listener);
	}
	removeEventListener(type, listener) {
		this.off(type, listener);
	}
	dispatchEvent(event) {
		return this.emit(event.type, event);
	}
}
