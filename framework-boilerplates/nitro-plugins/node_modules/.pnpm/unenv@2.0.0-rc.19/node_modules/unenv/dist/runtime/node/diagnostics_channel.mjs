import { Channel, getChannels } from "./internal/diagnostics_channel/channel.mjs";
import { TracingChannel } from "./internal/diagnostics_channel/tracing-channel.mjs";
export { Channel } from "./internal/diagnostics_channel/channel.mjs";
export const channel = function(name) {
	const channels = getChannels();
	if (name in channels) {
		return channels[name];
	}
	return new Channel(name);
};
export const hasSubscribers = function(name) {
	const channels = getChannels();
	const channel = channels[name];
	return channel && channel.hasSubscribers;
};
export const subscribe = function(name, onMessage) {
	channel(name).subscribe(onMessage);
};
export const unsubscribe = function(name, onMessage) {
	return channel(name).unsubscribe(onMessage);
};
export const tracingChannel = function(name) {
	return new TracingChannel(name);
};
// TracingChannel is incorrectly exposed on the `diagnostics_channel` type. In addition, its type
// takes a constructor with no arguments, whereas the node implementation takes a name (matching `tracingChannel`)
export default {
	Channel,
	channel,
	hasSubscribers,
	subscribe,
	tracingChannel,
	unsubscribe
};
