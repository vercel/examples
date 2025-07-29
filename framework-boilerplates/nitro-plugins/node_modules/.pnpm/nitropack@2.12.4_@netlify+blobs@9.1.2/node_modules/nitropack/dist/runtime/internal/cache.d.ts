import { type EventHandler } from "h3";
import type { EventHandlerRequest, EventHandlerResponse } from "h3";
import type { CacheOptions, CachedEventHandlerOptions } from "nitropack/types";
export declare function defineCachedFunction<T, ArgsT extends unknown[] = any[]>(fn: (...args: ArgsT) => T | Promise<T>, opts?: CacheOptions<T, ArgsT>): (...args: ArgsT) => Promise<T>;
export declare function cachedFunction<T, ArgsT extends unknown[] = any[]>(fn: (...args: ArgsT) => T | Promise<T>, opts?: CacheOptions<T>): (...args: ArgsT) => Promise<T | undefined>;
export declare function defineCachedEventHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request, Response>, opts?: CachedEventHandlerOptions<Response>): EventHandler<Omit<Request, "body">, Response>;
export declare function defineCachedEventHandler<Request = Omit<EventHandlerRequest, "body">, Response = EventHandlerResponse>(handler: EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>, opts?: CachedEventHandlerOptions<Request extends EventHandlerRequest ? Response : Request>): EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>;
export declare const cachedEventHandler: typeof defineCachedEventHandler;
