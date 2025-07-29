// https://nodejs.org/api/events.html
import type nodeEvents from "node:events";
export { _EventEmitter as EventEmitter, EventEmitterAsyncResource, addAbortListener, getEventListeners, getMaxListeners, on, once } from "./internal/events/events.mjs";
export declare const usingDomains: boolean;
export declare const captureRejectionSymbol: unknown;
export declare const captureRejections: boolean;
export declare const errorMonitor: unknown;
export declare const defaultMaxListeners = 10;
export declare const setMaxListeners: unknown;
export declare const listenerCount: unknown;
export declare const init: unknown;
declare const _default: typeof nodeEvents;
export default _default;
