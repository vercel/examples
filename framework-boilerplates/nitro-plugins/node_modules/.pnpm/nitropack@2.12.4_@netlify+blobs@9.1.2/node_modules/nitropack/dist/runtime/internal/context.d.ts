import { type H3Event } from "h3";
export declare const nitroAsyncContext: import("unctx/index").UseContext<NitroAsyncContext>;
/**
 *
 * Access to the current Nitro request event.
 *
 * @experimental
 *  - Requires `experimental.asyncContext: true` config to work.
 *  - Works in Node.js and limited runtimes only
 *
 */
export declare function useEvent(): H3Event;
