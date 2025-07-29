import { EventEmitter } from "node:events";
import { notImplemented } from "../_internal/utils.mjs";
export const SCHED_NONE = 1;
export const SCHED_RR = 2;
export const isMaster = true;
export const isPrimary = true;
export const isWorker = false;
export const schedulingPolicy = SCHED_RR;
export const settings = {};
export const workers = {};
export const fork = /* @__PURE__ */ notImplemented("cluster.fork");
export const disconnect = /* @__PURE__ */ notImplemented("cluster.disconnect");
export const setupPrimary = /* @__PURE__ */ notImplemented("cluster.setupPrimary");
export const setupMaster = /* @__PURE__ */ notImplemented("cluster.setupMaster");
// Make ESM coverage happy
export const _events = [];
export const _eventsCount = 0;
export const _maxListeners = 0;
export class Worker extends EventEmitter {
	_connected = false;
	id = 0;
	get process() {
		return globalThis.process;
	}
	get exitedAfterDisconnect() {
		return this._connected;
	}
	isConnected() {
		return this._connected;
	}
	isDead() {
		return true;
	}
	send(message, sendHandle, options, callback) {
		return false;
	}
	kill(signal) {
		this._connected = false;
	}
	destroy(signal) {
		this._connected = false;
	}
	disconnect() {
		this._connected = false;
	}
}
class _Cluster extends EventEmitter {
	Worker = Worker;
	isMaster = isMaster;
	isPrimary = isPrimary;
	isWorker = isWorker;
	SCHED_NONE = SCHED_NONE;
	SCHED_RR = SCHED_RR;
	schedulingPolicy = SCHED_RR;
	settings = settings;
	workers = workers;
	setupPrimary() {
		return setupPrimary();
	}
	setupMaster() {
		return setupPrimary();
	}
	disconnect() {
		return disconnect();
	}
	fork() {
		return fork();
	}
}
export default new _Cluster();
