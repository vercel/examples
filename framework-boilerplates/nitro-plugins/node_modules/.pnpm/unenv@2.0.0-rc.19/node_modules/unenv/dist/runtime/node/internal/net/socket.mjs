// Relative stream import required, see https://github.com/unjs/unenv/issues/353
import { Duplex } from "../stream/duplex.mjs";
// Docs: https://nodejs.org/api/net.html#net_class_net_socket
export class Socket extends Duplex {
	__unenv__ = true;
	bufferSize = 0;
	bytesRead = 0;
	bytesWritten = 0;
	connecting = false;
	destroyed = false;
	pending = false;
	localAddress = "";
	localPort = 0;
	remoteAddress = "";
	remoteFamily = "";
	remotePort = 0;
	autoSelectFamilyAttemptedAddresses = [];
	readyState = "readOnly";
	constructor(_options) {
		super();
	}
	write(_buffer, _arg1, _arg2) {
		return false;
	}
	connect(_arg1, _arg2, _arg3) {
		return this;
	}
	end(_arg1, _arg2, _arg3) {
		return this;
	}
	setEncoding(_encoding) {
		return this;
	}
	pause() {
		return this;
	}
	resume() {
		return this;
	}
	setTimeout(_timeout, _callback) {
		return this;
	}
	setNoDelay(_noDelay) {
		return this;
	}
	setKeepAlive(_enable, _initialDelay) {
		return this;
	}
	address() {
		return {};
	}
	unref() {
		return this;
	}
	ref() {
		return this;
	}
	destroySoon() {
		this.destroy();
	}
	resetAndDestroy() {
		const err = new Error("ERR_SOCKET_CLOSED");
		err.code = "ERR_SOCKET_CLOSED";
		this.destroy(err);
		return this;
	}
}
export class SocketAddress {
	__unenv__ = true;
	address;
	family;
	port;
	flowlabel;
	static parse(_address, _port) {
		return undefined;
	}
	constructor(options) {
		this.address = options.address;
		this.family = options.family;
		this.port = options.port;
		this.flowlabel = options.flowlabel;
	}
}
