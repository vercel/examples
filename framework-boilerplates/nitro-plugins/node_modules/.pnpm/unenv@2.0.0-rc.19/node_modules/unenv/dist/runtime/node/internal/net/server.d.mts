import type nodeNet from "node:net";
import { EventEmitter } from "node:events";
// Docs: https://nodejs.org/api/net.html#net_class_net_server
export declare class Server extends EventEmitter implements nodeNet.Server {
	readonly __unenv__: true;
	maxConnections: number;
	connections: number;
	readonly listening: boolean;
	constructor(arg1?: nodeNet.ServerOpts | ((socket: nodeNet.Socket) => void), arg2?: (socket: nodeNet.Socket) => void);
	listen(): this;
	close(callback?: (err?: Error) => void): this;
	address(): nodeNet.AddressInfo | string | null;
	getConnections(cb: (error: Error | null, count: number) => void): void;
	ref(): this;
	unref(): this;
	[Symbol.asyncDispose](): Promise<void>;
}
