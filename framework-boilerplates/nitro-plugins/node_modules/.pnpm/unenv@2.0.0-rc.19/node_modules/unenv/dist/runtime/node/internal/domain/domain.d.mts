import { EventEmitter } from "node:events";
import type nodeDomain from "node:domain";
export declare class Domain extends EventEmitter implements nodeDomain.Domain {
	readonly __unenv__: true;
	members: unknown;
	add();
	enter();
	exit();
	remove();
	bind<T>(callback: T): T;
	intercept<T>(callback: T): T;
	run<T>(fn: (...args: any[]) => T, ...args: any[]): T;
}
