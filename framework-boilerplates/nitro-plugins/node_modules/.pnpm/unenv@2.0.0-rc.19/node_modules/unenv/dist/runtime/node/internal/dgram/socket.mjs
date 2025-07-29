import { EventEmitter } from "node:events";
export class Socket extends EventEmitter {
	__unenv__ = true;
	bind() {
		return this;
	}
	close() {
		return this;
	}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
	getRecvBufferSize() {
		return 1e5;
	}
	getSendBufferSize() {
		return 1e4;
	}
	getSendQueueSize() {
		return 0;
	}
	getSendQueueCount() {
		return 0;
	}
	setMulticastLoopback() {
		return false;
	}
	setMulticastTTL() {
		return 1;
	}
	setTTL() {
		return 1;
	}
	address() {
		return {
			address: "127.0.0.1",
			family: "IPv4",
			port: 1234
		};
	}
	remoteAddress() {
		throw new Error("ERR_SOCKET_DGRAM_NOT_CONNECTED");
	}
	[Symbol.asyncDispose]() {
		return Promise.resolve();
	}
	addMembership() {}
	addSourceSpecificMembership() {}
	connect() {}
	disconnect() {}
	dropMembership() {}
	dropSourceSpecificMembership() {}
	send() {}
	setSendBufferSize() {}
	setBroadcast() {}
	setRecvBufferSize() {}
	setMulticastInterface() {}
}
