import { createNotImplementedError } from "../../../_internal/utils.mjs";
import { Channel } from "./channel.mjs";
export class TracingChannel {
	__unenv__ = true;
	asyncEnd = new Channel("asyncEnd");
	asyncStart = new Channel("asyncStart");
	end = new Channel("end");
	error = new Channel("error");
	start = new Channel("start");
	constructor(nameOrChannels) {
		if (typeof nameOrChannels === "string") {
			this.asyncEnd = new Channel(`trace:${nameOrChannels}:asyncEnd`);
			this.asyncStart = new Channel(`trace:${nameOrChannels}:asyncStart`);
			this.end = new Channel(`trace:${nameOrChannels}:end`);
			this.error = new Channel(`trace:${nameOrChannels}:error`);
			this.start = new Channel(`trace:${nameOrChannels}:start`);
		} else {
			this.asyncStart = nameOrChannels.asyncStart;
			this.asyncEnd = nameOrChannels.asyncEnd;
			this.end = nameOrChannels.end;
			this.error = nameOrChannels.error;
			this.start = nameOrChannels.start;
		}
	}
	subscribe(handlers) {
		this.asyncEnd?.subscribe(handlers.asyncEnd);
		this.asyncStart?.subscribe(handlers.asyncStart);
		this.end?.subscribe(handlers.end);
		this.error?.subscribe(handlers.error);
		this.start?.subscribe(handlers.start);
	}
	unsubscribe(handlers) {
		this.asyncEnd?.unsubscribe(handlers.asyncEnd);
		this.asyncStart?.unsubscribe(handlers.asyncStart);
		this.end?.unsubscribe(handlers.end);
		this.error?.unsubscribe(handlers.error);
		this.start?.unsubscribe(handlers.start);
	}
	traceSync() {
		throw createNotImplementedError("TracingChannel.traceSync");
	}
	tracePromise() {
		throw createNotImplementedError("TracingChannel.tracePromise");
	}
	traceCallback() {
		throw createNotImplementedError("TracingChannel.traceCallback");
	}
}
