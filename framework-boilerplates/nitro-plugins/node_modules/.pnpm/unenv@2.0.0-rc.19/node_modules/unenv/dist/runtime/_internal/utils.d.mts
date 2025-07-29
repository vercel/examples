import type { HeadersObject } from "./types.mjs";
export declare function rawHeaders(headers: HeadersObject);
type Fn = (...args: any[]) => any;
export declare function mergeFns(...functions: Fn[]): unknown;
export declare function createNotImplementedError(name: string);
export declare function notImplemented<Fn extends (...args: any) => any>(name: string): Fn;
export interface Promisifiable {
	(): any;
	native: Promisifiable;
	__promisify__: () => Promise<any>;
}
export declare function notImplementedAsync(name: string): Promisifiable;
export declare function notImplementedClass<T = unknown>(name: string): T;
export {};
