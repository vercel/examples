import type nodeDagnosticsChannel from "node:diagnostics_channel";
import { Channel } from "./channel.mjs";
export declare class TracingChannel<
	StoreType = unknown,
	ContextType extends object = object
> implements nodeDagnosticsChannel.TracingChannel<StoreType, ContextType> {
	readonly __unenv__: true;
	asyncEnd: Channel<StoreType, ContextType>;
	asyncStart: Channel<StoreType, ContextType>;
	end: Channel<StoreType, ContextType>;
	error: Channel<StoreType, ContextType>;
	start: Channel<StoreType, ContextType>;
	constructor(nameOrChannels: string | nodeDagnosticsChannel.TracingChannelCollection<StoreType, ContextType>);
	subscribe(handlers: nodeDagnosticsChannel.TracingChannelSubscribers<ContextType>): void;
	unsubscribe(handlers: nodeDagnosticsChannel.TracingChannelSubscribers<ContextType>): void;
	traceSync();
	tracePromise();
	traceCallback();
}
