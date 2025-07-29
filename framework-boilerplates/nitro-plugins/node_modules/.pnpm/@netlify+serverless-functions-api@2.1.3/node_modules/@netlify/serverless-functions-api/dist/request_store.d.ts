import { AsyncLocalStorage } from 'node:async_hooks';
import type { CacheAPIContext } from './cache.js';
import type { Context } from './context.js';
import { OperationCounter } from './operation_counter.js';
interface RequestStoreContent {
    cacheAPI: CacheAPIContext;
    cdnLoopHeader: string | null;
    context: Context;
    operationCounter: OperationCounter;
}
export declare const requestStore: AsyncLocalStorage<RequestStoreContent>;
export {};
