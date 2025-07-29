import type nodeAsyncHooks from "node:async_hooks";
export declare const createHook: typeof nodeAsyncHooks.createHook;
export declare const executionAsyncId: typeof nodeAsyncHooks.executionAsyncId;
export declare const executionAsyncResource: typeof nodeAsyncHooks.executionAsyncResource;
export declare const triggerAsyncId: typeof nodeAsyncHooks.triggerAsyncId;
// @ts-expect-error @types/node is missing this one - this is a bug in typings
export declare const asyncWrapProviders: typeof nodeAsyncHooks.asyncWrapProviders;
