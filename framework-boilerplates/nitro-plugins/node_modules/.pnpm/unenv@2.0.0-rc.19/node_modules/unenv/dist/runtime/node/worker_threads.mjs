import { BroadcastChannel } from "./internal/worker_threads/broadcast-channel.mjs";
import { MessageChannel } from "./internal/worker_threads/message-channel.mjs";
import { MessagePort } from "./internal/worker_threads/message-port.mjs";
import { Worker } from "./internal/worker_threads/worker.mjs";
import { notImplemented } from "../_internal/utils.mjs";
export { BroadcastChannel } from "./internal/worker_threads/broadcast-channel.mjs";
export { MessageChannel } from "./internal/worker_threads/message-channel.mjs";
export { MessagePort } from "./internal/worker_threads/message-port.mjs";
export { Worker } from "./internal/worker_threads/worker.mjs";
const _environmentData = new Map();
export const getEnvironmentData = function getEnvironmentData(key) {
	return _environmentData.get(key);
};
export const setEnvironmentData = function setEnvironmentData(key, value) {
	_environmentData.set(key, value);
};
export const isMainThread = true;
export const isMarkedAsUntransferable = () => false;
export const markAsUntransferable = function markAsUntransferable(value) {
	// noop
};
export const markAsUncloneable = () => {
	// noop
};
export const moveMessagePortToContext = () => new MessagePort();
export const parentPort = null;
export const receiveMessageOnPort = () => undefined;
export const SHARE_ENV = /* @__PURE__ */ Symbol.for("nodejs.worker_threads.SHARE_ENV");
export const resourceLimits = {};
export const threadId = 0;
export const workerData = null;
// https://nodejs.org/api/worker_threads.html#workerpostmessagetothreadthreadid-value-transferlist-timeout
export const postMessageToThread = /* @__PURE__ */ notImplemented("worker_threads.postMessageToThread");
export const isInternalThread = false;
export default {
	BroadcastChannel,
	MessageChannel,
	MessagePort,
	Worker,
	SHARE_ENV,
	getEnvironmentData,
	isMainThread,
	isMarkedAsUntransferable,
	markAsUntransferable,
	markAsUncloneable,
	moveMessagePortToContext,
	parentPort,
	receiveMessageOnPort,
	resourceLimits,
	setEnvironmentData,
	postMessageToThread,
	threadId,
	workerData,
	isInternalThread
};
