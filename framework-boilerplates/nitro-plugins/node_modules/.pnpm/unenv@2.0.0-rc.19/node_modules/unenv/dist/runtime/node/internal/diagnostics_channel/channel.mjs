import { createNotImplementedError } from "../../../_internal/utils.mjs";
const channels = {};
export const getChannels = () => channels;
export class Channel {
	__unenv__ = true;
	name;
	get hasSubscribers() {
		return this._subscribers.length > 0;
	}
	_subscribers;
	constructor(name) {
		this.name = name;
		this._subscribers = [];
		const channels = getChannels();
		channels[name] = this;
	}
	subscribe(onMessage) {
		this._subscribers.push(onMessage);
	}
	unsubscribe(onMessage) {
		const index = this._subscribers.indexOf(onMessage);
		if (index === -1) return false;
		this._subscribers.splice(index, 1);
		return true;
	}
	publish(message) {
		for (const subscriber of this._subscribers) {
			subscriber(message, this.name);
		}
	}
	bindStore() {
		throw createNotImplementedError("Channel.bindStore");
	}
	unbindStore() {
		throw createNotImplementedError("Channel.unbindStore");
	}
	runStores() {
		throw createNotImplementedError("Channel.runStores");
	}
}
