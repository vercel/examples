import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
export class Worker extends EventEmitter {
	stdin = null;
	stdout = new Readable();
	stderr = new Readable();
	threadId = 0;
	performance = { eventLoopUtilization: () => ({
		idle: 0,
		active: 0,
		utilization: 0
	}) };
	postMessage(_value, _transferList) {}
	postMessageToThread(_threadId, _value, _transferList, _timeout) {
		return Promise.resolve();
	}
	ref() {}
	unref() {}
	terminate() {
		return Promise.resolve(0);
	}
	getHeapSnapshot() {
		return Promise.resolve(new Readable());
	}
}
