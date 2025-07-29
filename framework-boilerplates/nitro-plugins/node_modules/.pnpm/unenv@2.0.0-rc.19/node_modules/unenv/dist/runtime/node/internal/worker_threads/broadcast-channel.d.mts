import type nodeWorkerThreads from "node:worker_threads";
export declare class BroadcastChannel implements nodeWorkerThreads.BroadcastChannel {
	name: string;
	onmessage;
	onmessageerror;
	close();
	postMessage(message: unknown);
	ref();
	unref();
}
