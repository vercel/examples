import { EventEmitter } from "node:events";
import type nodeWorkerThreads from "node:worker_threads";
export declare class Worker extends EventEmitter implements nodeWorkerThreads.Worker {
	stdin: null;
	stdout;
	stderr;
	threadId: number;
	performance: {
		eventLoopUtilization: () => {
			idle: number;
			active: number;
			utilization: number;
		};
	};
	postMessage(_value: any, _transferList?: readonly nodeWorkerThreads.TransferListItem[] | undefined);
	postMessageToThread(_threadId: unknown, _value: unknown, _transferList?: unknown, _timeout?: unknown): Promise<void>;
	ref();
	unref();
	terminate();
	getHeapSnapshot();
}
