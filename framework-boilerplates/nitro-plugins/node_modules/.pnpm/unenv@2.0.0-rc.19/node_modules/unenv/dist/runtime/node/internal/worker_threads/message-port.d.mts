import { EventEmitter } from "node:events";
import type nodeWorkerThreads from "node:worker_threads";
export declare class MessagePort extends EventEmitter implements nodeWorkerThreads.MessagePort {
	close();
	postMessage(value: any, transferList?: readonly nodeWorkerThreads.TransferListItem[] | undefined);
	ref();
	unref();
	start();
	addEventListener(type: string, listener: (...args: any[]) => void): void;
	removeEventListener(type: string, listener: (...args: any[]) => void): void;
	dispatchEvent(event: Event);
}
