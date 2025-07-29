import type nodeNet from "node:net";
import { type Callback, type BufferEncoding } from "../../../_internal/types.mjs";
// Relative stream import required, see https://github.com/unjs/unenv/issues/353
import { Duplex } from "../stream/duplex.mjs";
// Docs: https://nodejs.org/api/net.html#net_class_net_socket
export declare class Socket extends Duplex implements nodeNet.Socket {
	readonly __unenv__: true;
	readonly bufferSize: number;
	readonly bytesRead: number;
	readonly bytesWritten: number;
	readonly connecting: boolean;
	readonly destroyed: boolean;
	readonly pending: boolean;
	readonly localAddress: string;
	readonly localPort: number;
	readonly remoteAddress?: string;
	readonly remoteFamily?: string;
	readonly remotePort?: number;
	readonly autoSelectFamilyAttemptedAddresses: readonly [];
	readonly readyState: nodeNet.SocketReadyState;
	constructor(_options?: nodeNet.SocketConstructorOpts);
	write(_buffer: Uint8Array | string, _arg1?: BufferEncoding | Callback<Error | undefined>, _arg2?: Callback<Error | undefined>): boolean;
	connect(_arg1: number | string | nodeNet.SocketConnectOpts, _arg2?: string | Callback, _arg3?: Callback);
	end(_arg1?: Callback | Uint8Array | string, _arg2?: BufferEncoding | Callback, _arg3?: Callback);
	setEncoding(_encoding?: BufferEncoding): this;
	pause();
	resume();
	setTimeout(_timeout: number, _callback?: Callback): this;
	setNoDelay(_noDelay?: boolean): this;
	setKeepAlive(_enable?: boolean, _initialDelay?: number): this;
	address(): {};
	unref();
	ref();
	destroySoon();
	resetAndDestroy();
}
export declare class SocketAddress implements nodeNet.SocketAddress {
	readonly __unenv__: true;
	address: string;
	family: "ipv4" | "ipv6";
	port: number;
	flowlabel: number;
	static parse(_address: string, _port?: number): undefined;
	constructor(options: nodeNet.SocketAddress);
}
