import { createNotImplementedError } from "../../../_internal/utils.mjs";
import { EventEmitter } from "node:events";
// Docs: https://nodejs.org/api/net.html#net_class_net_server
export class Server extends EventEmitter {
	__unenv__ = true;
	maxConnections = 1;
	connections = 0;
	listening = false;
	constructor(arg1, arg2) {
		super();
	}
	listen() {
		throw createNotImplementedError("node:net.Server.listen()");
	}
	close(callback) {
		throw createNotImplementedError("node:net.Server.close()");
	}
	address() {
		return null;
	}
	getConnections(cb) {
		cb(null, 0);
	}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
	[Symbol.asyncDispose]() {
		return Promise.resolve();
	}
}
