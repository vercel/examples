import type nodeHttp from "node:http";
import { EventEmitter } from "node:events";
export declare class Agent extends EventEmitter implements nodeHttp.Agent {
	__unenv__: {};
	maxFreeSockets: number;
	maxSockets: number;
	maxTotalSockets: number;
	readonly freeSockets: {};
	readonly sockets: {};
	readonly requests: {};
	readonly options: nodeHttp.AgentOptions;
	constructor(opts?: nodeHttp.AgentOptions);
	destroy(): void;
}
