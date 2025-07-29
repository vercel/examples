import { type H3Event } from "h3";
import type { NitroRouteRules } from "nitropack/types";
export declare function createRouteRulesHandler(ctx: {
    localFetch: typeof globalThis.fetch;
}): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<any> | undefined>;
export declare function getRouteRules(event: H3Event): NitroRouteRules;
type DeepReadonly<T> = T extends Record<string, any> ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : T;
/**
 * @param path - The path to match against route rules. This should not contain a query string.
 */
export declare function getRouteRulesForPath(path: string): DeepReadonly<NitroRouteRules>;
export {};
