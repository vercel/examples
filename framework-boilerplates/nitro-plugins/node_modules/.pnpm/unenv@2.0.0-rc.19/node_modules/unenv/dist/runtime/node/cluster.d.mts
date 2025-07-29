import type nodeCluster from "node:cluster";
import type { Worker as NodeClusterWorker } from "node:cluster";
import { EventEmitter } from "node:events";
export declare const SCHED_NONE: typeof nodeCluster.SCHED_NONE;
export declare const SCHED_RR: typeof nodeCluster.SCHED_RR;
export declare const isMaster: typeof nodeCluster.isMaster;
export declare const isPrimary: typeof nodeCluster.isPrimary;
export declare const isWorker: typeof nodeCluster.isWorker;
export declare const schedulingPolicy: typeof nodeCluster.schedulingPolicy;
export declare const settings: typeof nodeCluster.settings;
export declare const workers: typeof nodeCluster.workers;
export declare const fork: typeof nodeCluster.fork;
export declare const disconnect: typeof nodeCluster.disconnect;
export declare const setupPrimary: typeof nodeCluster.setupPrimary;
export declare const setupMaster: typeof nodeCluster.setupMaster;
// Make ESM coverage happy
export declare const _events: unknown;
export declare const _eventsCount = 0;
export declare const _maxListeners = 0;
export declare class Worker extends EventEmitter implements NodeClusterWorker {
	_connected: boolean;
	id: number;
	get process(): any;
	get exitedAfterDisconnect();
	isConnected(): boolean;
	isDead(): boolean;
	send(message: any, sendHandle?: any, options?: any, callback?: any): boolean;
	kill(signal?: string): void;
	destroy(signal?: string): void;
	disconnect(): void;
}
declare const _default;
export default _default;
