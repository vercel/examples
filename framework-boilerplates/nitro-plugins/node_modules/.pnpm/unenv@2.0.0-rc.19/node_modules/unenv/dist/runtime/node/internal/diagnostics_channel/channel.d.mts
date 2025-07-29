import type nodeDiagnosticsChannel from "node:diagnostics_channel";
export declare const getChannels: unknown;
export declare class Channel<
	StoreType,
	ContextType
> implements nodeDiagnosticsChannel.Channel<StoreType, ContextType> {
	readonly __unenv__: true;
	name: nodeDiagnosticsChannel.Channel["name"];
	get hasSubscribers();
	_subscribers: nodeDiagnosticsChannel.ChannelListener[];
	constructor(name: nodeDiagnosticsChannel.Channel["name"]);
	subscribe(onMessage: nodeDiagnosticsChannel.ChannelListener);
	unsubscribe(onMessage: nodeDiagnosticsChannel.ChannelListener);
	publish(message: unknown): void;
	bindStore();
	unbindStore();
	runStores();
}
